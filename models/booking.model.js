import { PhoneNumber } from "@clerk/express";
import mongoose, { Schema } from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    tourist: { type: String, ref: "User" },
    tour: { type: Schema.Types.ObjectId, ref: "Tour" },
    totalCost: { type: Number, required: true },
    mainTourist: {
      firstName: { type: String, required: true },
      surname: { type: String, required: true },
      email: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, "Email is required"],
        match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
      },
      phoneNumber: {
        type: String,
        required: [true, "Phone Number is required"],
      },
      passportNumber: {
        type: String,
        required: [true, "Please provide you passport number"],
      },
      nacionality: {
        type: String,
        required: [true, "Nacionality is required"],
      },
      language: { type: String },
      flightInformation: {
        arrival: { time: { type: String }, flightNumber: { type: String } },
        depature: { time: { type: String }, flightNumber: { type: String } },
      },
      hotel: { type: String },
      pickup: {
        type: Boolean,
        required: [true, "Please let us know if you require airport pickup"],
      },
    },
    additionalTourist: [
      {
        firstName: { type: String },
        surname: { type: String },
        passportNumber: { type: String },
        nacionality: { type: String },
      },
    ],

    emergencyContact: {
      fullName: { type: String },
      relationship: { type: String },
      PhoneNumber: { type: String },
    },
    comments: { type: String },
    checkIn: { type: Date },
    checkOut: { type: Date },
    Balance: {
      type: Number,
      required: true,
      default: function () {
        return this.totalCost - this.bookingPayment;
      },
    },
    status: {
      type: String,
      enum: ["Completed", "Incoming", "Cancelled"],
      default: "Incoming",
    },
    bookingPayment: { type: Number, required: true },
    isPaid: { type: Boolean },
    stripe: {
      depositPaymentIntentId: { type: String },
      balancePaymentIntentId: { type: String },
      customerId: { type: String },
    },
  },

  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
