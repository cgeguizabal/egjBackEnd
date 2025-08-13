import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBooking,
  deleteBooking,
  getBookingByID,
  getBookings,
  updateBooking,
  updateBookingPaymentStatus,
} from "../controllers/booking.controller.js";
import { adminOnly } from "../middleware/adminAuthMiddleware.js";
import {
  createBookingAdmin,
  deleteBookingAdmin,
  getBookingByIDAdmin,
  getBookingsAdmin,
  updateBookingAdmin,
} from "../controllers/bookingAdmin.controller.js";
import { stripeWebhook } from "../controllers/stripeWebhook.controller.js";

const bookingRouter = express.Router();

// Webhook route should use raw body parser middleware because Stripe needs raw payload
bookingRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

//route for Admins to create personalised bookings
bookingRouter.post("/admin", protect, adminOnly, createBookingAdmin);
bookingRouter.get("/admin", protect, adminOnly, getBookingsAdmin);
bookingRouter.get("/admin/:id", protect, adminOnly, getBookingByIDAdmin);
bookingRouter.put("/admin/:id", protect, adminOnly, updateBookingAdmin);
bookingRouter.delete("/admin/:id", protect, adminOnly, deleteBookingAdmin);

bookingRouter.post("/", protect, createBooking);
bookingRouter.get("/", protect, getBookings);
bookingRouter.get("/:id", protect, getBookingByID);
bookingRouter.put("/:id", protect, updateBooking);
bookingRouter.delete("/:id", protect, adminOnly, deleteBooking);

//route for Stripe
// bookingRouter.put("/webhook/:id", updateBookingPaymentStatus); // no protect middleware

export default bookingRouter;
