import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { priceId, quantity = 1, tourId, userId } = req.body;

    if (!priceId || quantity < 1) {
      return res
        .status(400)
        .json({ error: "Missing or invalid priceId or quantity" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        tourId: tourId || "unknown",
        userId: userId || "guest",
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};
