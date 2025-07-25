import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Root endpoint to confirm server is running
router.get("/", (req, res) => {
  res.send("EXPEDITIONS GEORGE OF THE JUNGLE SERVER IS WORKING FINE");
});

//Health check endpoint to check MongoDB connection status
router.get("/health", (req, res) => {
  const state = mongoose.connection.readyState;

  if (state === 1) {
    res.status(200).send("DATABASE WITH MONGODB CONNECTED SUCCESSFULLY");
  } else {
    res.status(500).send("Database not conneceted");
  }
});

export default router;
