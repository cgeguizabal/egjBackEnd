import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);

export default GalleryImage;
