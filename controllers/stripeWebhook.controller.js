import Stripe from "stripe";
import Booking from "../models/booking.model.js";
import { sendEmail } from "../utils/email.js";

const stripe = new Stripe(process.env.STRIPE_API_SECRET);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify Stripe webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // Only trigger on successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // 1️⃣ Update booking status in MongoDB
    const bookingId = session.metadata.bookingId;
    if (bookingId) {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          isPaid: true,
          $unset: { expireAt: "" },
          "stripe.depositPaymentIntentId": session.payment_intent, // Update the booking with paymentIntentId and customerId
          "stripe.customerId": session.customer,
        },
        { new: true }
      );

      if (booking) {
        // 2️⃣ Send confirmation email to client
        await sendEmail({
          to: booking.mainTourist.email,
          subject: "Your Booking is Confirmed ✅",
          html: `
            <h2>Hello ${booking.mainTourist.firstName},</h2>
            <p>Your booking is confirmed! Here are your details:</p>
            <ul>
              <li>Tour: ${booking.tour}</li>
              <li>Total tourists: ${booking.totalTourists}</li>
              <li>Total cost: $${booking.totalCost}</li>
              <li>Deposit paid: $${booking.bookingPayment}</li>
            </ul>
            <p>Thank you for booking with us!</p>
          `,
        });

        // 3️⃣ Send notification email to admin
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: "New Booking Received",
          html: `
            <h2>New Booking!</h2>
            <p>Booking ID: ${booking._id}</p>
            <p>Client: ${booking.mainTourist.firstName} ${booking.mainTourist.surname}</p>
            <p>Tour: ${booking.tour}</p>
            <p>Total tourists: ${booking.totalTourists}</p>
            <p>Deposit paid: $${booking.bookingPayment}</p>
          `,
        });
      }
    }
  }

  res.json({ received: true });
};
