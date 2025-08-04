import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createBooking } from "../controllers/booking.controller.js";

const bookingRouter = express.Router();

bookingRouter.post("/", protect, createBooking);

export default bookingRouter;
