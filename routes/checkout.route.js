import express from "express";
import { createCheckoutSession } from "../controllers/checkoutController.js";

const checkoutRouter = express.Router();
checkoutRouter.post("/", createCheckoutSession);

export default checkoutRouter;
