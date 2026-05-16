import axios from "axios";
import Review from "../models/Review.js";
import { User } from "../models/auth.model.js";

export const addReview = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { rating, comment, tags } = req.body;
    const userId = req.user.id;

     if (!rating || !comment) {
       return res.status(400).json({
         message: "Rating and comment are required",
       });
     }

    // 1. Database se user fetch karo verified profile info ke liye
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚨 2. CODE GUARD: Manual validation to check if user already reviewed this city
    const existingReview = await Review.findOne({ userId, cityId });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already submitted a review for this city!",
      });
    }

    // 3. New review document banao
    const newReview = new Review({
      cityId,
      userId,
      rating,
      comment,
      tags: tags || [],
      userName: user.username,
      userPicture: user.avatarUrl || "",
    });

    // 4. Database mein save karo
    await newReview.save();

    return res.status(201).json({
      message: "Review posted successfully",
      review: newReview,
    });
  } catch (err) {
    // MongoDB level security fallback check
    if (err.code === 11000) {
      return res.status(400).json({
        message: "You have already submitted a review for this city!",
      });
    }
    console.error("Crash inside addReview:", err);
    return res
      .status(500)
      .json({ message: "Failed to post review due to server error" });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ cityId: req.params.cityId }).sort({
      createdAt: -1,
    });
    return res.json(reviews);
  } catch (error) {
    console.error("Error in getReviews:", error); // FIX: Fixed reference error from 'err' to 'error'
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

