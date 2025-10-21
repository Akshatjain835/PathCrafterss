import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    role: {
      type: String,
      enum: ["Performer", "Head"],
      default: "Performer",
    },
  },

  { timestamps: true }

);

export const User = mongoose.model("User", userSchema);
