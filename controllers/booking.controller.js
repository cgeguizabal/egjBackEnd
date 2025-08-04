import { json } from "express";
import Booking from "../models/booking.model.js";

//CREATE NEW BOOKING
export const createBooking = async (req, res) => {
  try {
    const {
      tour,
      totalCost,
      totalTourists,
      mainTourist,
      additionalTourist,
      emergencyContact,
      comments,
      checkIn,
      checkOut,
    } = req.body;

    if (!tour || !totalCost || !mainTourist) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    if (totalTourists !== additionalTourist.length + 1) {
      return res.status(400).json({
        success: false,
        message: "Missing tourists' information",
      });
    }

    // User info comes from protect middleware
    const totalFinalCost = totalCost * totalTourists;
    const userId = req.user._id;
    const bookingPayment = Math.floor(totalFinalCost * 0.3);
    const balance = totalFinalCost - bookingPayment;

    const newBooking = new Booking({
      tourist: userId,
      tour,
      totalTourists,
      totalCost: totalFinalCost,
      bookingPayment,
      balance,
      mainTourist,
      additionalTourist,
      emergencyContact,
      comments,
      checkIn,
      checkOut,
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      data: newBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//GET ALL BOOKINGS
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("tourist")
      .populate({
        path: "tourist",
        model: "User",
      })
      .populate("tour")
      .populate({
        path: "tour",
        model: "Tour",
      });

    res.status(302).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//Get Booking By ID
export const getBookingByID = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("tourist")
      .populate({
        path: "tourist",
        mode: "User",
      })
      .populate("tour")
      .populate({
        path: "tour",
        model: "Tour",
      });

    if (!booking) {
      res.status(401).json({
        success: false,
        message: "Booking documents not found",
      });
    }

    res.status(302).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//UPDATE BOOKING

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!booking) {
      res.status(401).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//UPDATE STATUS WITH STRIPE
// controllers/bookingController.js
export const updateBookingPaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { isPaid: true },
      { new: true }
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
