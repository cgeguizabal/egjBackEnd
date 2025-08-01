import express from "express";
import {
  createTour,
  deleteTour,
  getTourById,
  getTours,
} from "../controllers/tour.controller.js";
import { upload } from "../middleware/multer.js";

const tourRouter = express.Router();

tourRouter.post("/", upload.array("images"), createTour);
tourRouter.delete("/:id", deleteTour);
tourRouter.get("/", getTours);
tourRouter.get("/:id", getTourById);

export default tourRouter;
