import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  cityId: { type: String, required: true }, // The ID of the destination
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: String,
  userPicture: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  tags: [String], // e.g., ["Crowded", "Beautiful", "Expensive"]
  createdAt: { type: Date, default: Date.now },
});

reviewSchema.index({ userId: 1, cityId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);