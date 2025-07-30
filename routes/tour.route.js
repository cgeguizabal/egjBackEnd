import express from "express";
import { createTour, deleteTour } from "../controllers/tour.controller.js";
import { upload } from "../middleware/multer.js";

const tourRouter = express.Router();

tourRouter.post("/", upload.array("images"), createTour);
tourRouter.delete("/:id", deleteTour);

export default tourRouter;
