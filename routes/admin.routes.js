import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
  getById,
  newUser,
  updateRole,
} from "../controllers/user.controller.js";
import { adminOnly } from "../middleware/adminAuthMiddleware.js";

const adminRouter = express.Router();

//ENDPOINTS FOR ADMIN
adminRouter.get("/", protect, adminOnly, getAllUsers);
adminRouter.get("/:id", protect, adminOnly, getById);
adminRouter.put("/:id", protect, adminOnly, updateRole);
adminRouter.post("/", protect, adminOnly, newUser);
adminRouter.delete("/:id", protect, adminOnly, deleteUser);

export default adminRouter;
