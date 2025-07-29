import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Use Clerk user id as _id

    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    role: { type: String, enum: ["Tourist", "Admin"], default: "Tourist" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
