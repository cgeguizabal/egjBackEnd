import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_SECRET);

export const createCheckoutSession = async (req, res) => {
  try {
    const { unitPrice, quantity = 1, tourId, userId, bookingId } = req.body;

    // Validate inputs
    if (!unitPrice || quantity < 1 || !tourId || !userId || !bookingId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate 30% deposit
    const depositAmount = Math.round(unitPrice * 0.3); // Stripe expects price in cents

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd", // Change to your actual currency
            product_data: {
              name: `Tour Deposit for ${tourId}`,
            },
            unit_amount: depositAmount, // charge 30%
          },
          quantity,
        },
      ],
      payment_method_collection: "if_required",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        tourId,
        userId,
        bookingId,
        fullPricePerPerson: unitPrice, // optional: save full price
        chargedPercentage: "30%",
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};
