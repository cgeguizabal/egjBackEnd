import Stripe from "stripe";
import Booking from "../models/booking.model.js";

const stripe = new Stripe(process.env.STRIPE_API_SECRET);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const bookingId = session.metadata.bookingId;
    if (bookingId) {
      await Booking.findByIdAndUpdate(
        bookingId,
        {
          isPaid: true,
          $unset: { expireAt: "" },
          "stripe.depositPaymentIntentId": session.payment_intent, // Update the booking with paymentIntentId and customerId
          "stripe.customerId": session.customer,
        },
        { new: true }
      );
    }
  }

  res.json({ received: true });
};
