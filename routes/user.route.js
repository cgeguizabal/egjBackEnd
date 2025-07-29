import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData } from "../controllers/user.controller.js";

const userRouter = express.Router();

//GET USERS FROM CLERCK FETCHED DATA
userRouter.get("/", protect, getUserData);

export default userRouter;
