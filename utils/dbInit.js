import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../configs/db.js";
import Booking from "../models/booking.model.js"; // import your Booking model

async function createTTLIndex() {
  try {
    await connectDB(); // use your existing connection function

    // Create TTL index on expireAt field
    // This tells MongoDB to delete documents when expireAt date is reached (expireAfterSeconds: 0 means immediately after)
    await Booking.collection.createIndex(
      { expireAt: 1 },
      { expireAfterSeconds: 0 }
    );

    console.log("TTL index on expireAt created successfully.");
  } catch (error) {
    console.error("Error creating TTL index:", error);
  } finally {
    // Close connection after operation finishes
    await mongoose.connection.close();
  }
}

createTTLIndex();
