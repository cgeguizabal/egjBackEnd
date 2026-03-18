import express from "express";
import {
  getGalleryImages,
  likeGalleryImage,
  unlikeGalleryImage,
} from "../controllers/gallery.controller.js";

const galleryRouter = express.Router();

galleryRouter.get("/", getGalleryImages);
galleryRouter.post("/like", likeGalleryImage);
galleryRouter.post("/unlike", unlikeGalleryImage);

export default galleryRouter;
