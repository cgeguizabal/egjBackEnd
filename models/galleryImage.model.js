import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    public_id: { type: String, required: true, unique: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);

export default GalleryImage;
