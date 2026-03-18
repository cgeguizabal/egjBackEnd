import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [
      {
        url: { type: String, required: true }, // array of Cloudinary URLs
        public_id: { type: String, required: true }, // array of Cloudinary URLs
      },
    ],
    stripeProductId: { type: String, required: true },
  },
  { timestamps: true }
);

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
