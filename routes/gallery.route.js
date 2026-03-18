import express from "express";
import {
  getGalleryImages,
  likeGalleryImage,
  unlikeGalleryImage,
} from "../controllers/gallery.controller.js";

const galleryRouter = express.Router();

galleryRouter.get("/", getGalleryImages);
galleryRouter.post("/:publicId/like", likeGalleryImage);
galleryRouter.post("/:publicId/unlike", unlikeGalleryImage);

export default galleryRouter;
