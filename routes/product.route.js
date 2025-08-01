import express from "express";

import dotenv from "dotenv";
import {
  getAllProduct,
  getProductById,
} from "../controllers/product.controller.js";
import { createCheckoutSession } from "../controllers/checkoutController.js";
dotenv.config();

const productRouter = express.Router();

productRouter.get("/", getAllProduct);
productRouter.get("/:id", getProductById);
productRouter.post("/", createCheckoutSession);

export default productRouter;
