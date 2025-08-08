import BookingAdmin from "../models/bookingAdmin.model.js";

//CREATE NEW BOOKING
export const createBookingAdmin = async (req, res) => {
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

    const bookingPayment = Math.floor(totalFinalCost * 0.3);
    const balance = totalFinalCost - bookingPayment;

    const newBooking = new BookingAdmin({
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

      isPaid: false, // default but explicit
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
export const getBookingsAdmin = async (req, res) => {
  try {
    const bookings = await BookingAdmin.find().populate("tour").populate({
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
export const getBookingByIDAdmin = async (req, res) => {
  try {
    const booking = await BookingAdmin.findById(req.params.id)
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

export const updateBookingAdmin = async (req, res) => {
  try {
    const booking = await BookingAdmin.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

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

export const deleteBookingAdmin = async (req, res) => {
  try {
    const booking = await BookingAdmin.findByIdAndDelete(req.params.id);

    if (!booking) {
      res.status(401).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking has been deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
