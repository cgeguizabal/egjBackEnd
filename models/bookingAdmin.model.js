import mongoose from "mongoose";

const bookingAdminSchema = new mongoose.Schema(
  {
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour" },
    totalTourists: { type: Number, default: 1 },
    totalCost: { type: Number, required: true },
    bookingPayment: { type: Number, required: true },
    balance: {
      type: Number,
      required: true,
    },
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
        required: [true, "Please provide your passport number"],
      },
      nacionality: {
        type: String,
        required: [true, "Nationality is required"],
      },
      language: { type: String },
      flightInformation: {
        arrival: { date: { type: Date }, flightNumber: { type: String } },
        departure: { date: { type: Date }, flightNumber: { type: String } },
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
    status: {
      type: String,
      enum: ["Completed", "Incoming", "Cancelled"],
      default: "Incoming",
    },
    isPaid: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    // toJSON: { virtuals: true }, // Enable virtual fields in JSON output
    // toObject: { virtuals: true }, // Also enable for toObject calls
  }
);

const BookingAdmin = mongoose.model("BookingAdmin", bookingAdminSchema);

export default BookingAdmin;
