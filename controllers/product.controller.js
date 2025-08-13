import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_API_SECRET);

//GET TOURS FROM STRIPE
export const getAllProduct = async (req, res) => {
  try {
    const products = await stripe.products.list({ limit: 10 });

    // For each product, get its prices
    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
        });

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          images: product.images,
          prices: prices.data.map((price) => ({
            id: price.id,
            unit_amount: price.unit_amount,
            currency: price.currency,
          })),
        };
      })
    );

    res.status(200).json(productsWithPrices);
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

//GET TOURS BY ID FROM STRIPE
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    // Get product by ID
    const product = await stripe.products.retrieve(id);

    // Get prices related to this product
    const prices = await stripe.prices.list({
      product: id,
    });

    // Return product and its prices
    res.status(200).json({
      id: product.id,
      name: product.name,
      description: product.description,
      images: product.images,
      prices: prices.data.map((price) => ({
        id: price.id,
        unit_amount: price.unit_amount,
        currency: price.currency,
      })),
    });
  } catch (err) {
    console.error("❌ Error fetching product by ID:", error.message);
    res.status(404).json({ error: "Product not found" });
  }
};
