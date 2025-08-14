// stripe/productSetup.js
import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_API_SECRET);

async function createProductAndPrice() {
  try {
    // Step 1: Create a product
    const product = await stripe.products.create({
      name: "3 DAYS & 1 NIGHT",
      description:
        "Embark on a scenic journey along the Amazon River for approximately one hour to reach the Peruvian indigenous community of Gamboa. Upon arrival, settle into comfortable hammocks with mosquito nets for accommodation. The adventure into the jungle begins with an immersive 2 to 3-hour trek, encountering a diverse array of wildlife including monkeys, insects, towering trees, birds, spiders, and captivating many species of butterflies. After a satisfying lunch and some rest, embark on an afternoon boat or canoe ride along the river to observe a variety of birds such as macaws, parrots, kingfishers, herons, toucans, and horned screamers.",
      tax_code: "txcd_20030000",
    });

    console.log("✅ Product created:", product.id);

    // Step 2: Create a price for that product
    const price = await stripe.prices.create({
      unit_amount: 22000, // $150.00
      currency: "usd",
      product: product.id,
      tax_behavior: "exclusive", // make tax added on top
      tax_rates: ["txr_1RvogdCSZkTnlKztXXeRSnoC"], // your manual tax rate ID
    });

    console.log("✅ Price created:", price.id);
  } catch (error) {
    console.error("❌ Error creating product or price:", error.message);
  }
}

// Run the function when script is executaed
createProductAndPrice();
