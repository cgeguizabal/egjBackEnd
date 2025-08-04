import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getBookingByID,
  getBookings,
} from "../controllers/booking.controller.js";

const bookingRouter = express.Router();

bookingRouter.post("/", protect, createBooking);
bookingRouter.get("/", protect, getBookings);
bookingRouter.get("/:id", protect, getBookingByID);

export default bookingRouter;
