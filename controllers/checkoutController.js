import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_SECRET);

export const createCheckoutSession = async (req, res) => {
  try {
    const { productId, quantity = 1, userId, bookingId } = req.body;
    // Validate inputs
    if (!productId || quantity < 1 || !userId || !bookingId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1️⃣ Retrieve the Stripe product info from Stripe catalog
    const product = await stripe.products.retrieve(productId);

    // 2️⃣ Retrieve the price(s) associated with this product
    const prices = await stripe.prices.list({ product: productId });

    // 3️⃣ For simplicity, take the first price (you can adjust if you have multiple prices)
    const unitPrice = prices.data[0].unit_amount; // in cents

    // 4️⃣ Calculate 30% deposit

    const depositAmount = Math.round(unitPrice * 0.3); // Stripe expects price in cents

    // 5️⃣ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: prices.data[0].currency, // Use currency from Stripe
            product_data: {
              name: product.name, // Name from your Stripe product
              description: `Full price per person: $${(unitPrice / 100).toFixed(
                2
              )}. Deposit to pay now: $${(depositAmount / 100).toFixed(2)}`,
              images: product.images, // Show product images from Stripe
            },
            unit_amount: depositAmount, // Charge only deposit
            tax_rates: ["txr_1RvogdCSZkTnlKztXXeRSnoC"], // manual tax rate
          },
          quantity, // Multiply deposit by number of people
        },
      ],
      payment_method_collection: "always",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        productId,
        userId,
        bookingId,
        fullPricePerPerson: unitPrice, // optional: save full price
        chargedPercentage: "30%",
      },
    });
    // 6️⃣ Return the URL of the Stripe Checkout page to frontend
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};
