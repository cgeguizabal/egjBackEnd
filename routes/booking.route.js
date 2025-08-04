import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getBookingByID,
  getBookings,
  updateBooking,
  updateBookingPaymentStatus,
} from "../controllers/booking.controller.js";

const bookingRouter = express.Router();

bookingRouter.post("/", protect, createBooking);
bookingRouter.get("/", protect, getBookings);
bookingRouter.get("/:id", protect, getBookingByID);
bookingRouter.put("/:id", protect, updateBooking);

//route for Stripe
bookingRouter.put("/webhook/:id", updateBookingPaymentStatus); // no protect middleware

export default bookingRouter;
