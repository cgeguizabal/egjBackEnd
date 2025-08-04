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
