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


export const getRecomendPlaces = async (req, res) => {
  try {
    // 1. Ensure user session is present
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing user session" });
    }

    console.log(
      "User session found, proceeding with recommendations for user:",
      req.user.id,
    );
    const targetUserId = req.user.id.toString();

    // 2. Fetch reviews from Database
    const allRatings = await Review.find({}, "userId cityId rating");

    // Cold-start protection baseline threshold filter
    if (allRatings.length < 5) {
      console.log(
        `[ML Pipeline] Insufficient dataset (${allRatings.length}/5). Triggering Aggregation Fallback.`,
      );

      const popular = await Review.aggregate([
        {
          $group: {
            _id: "$cityId",
            avgRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
        { $match: { count: { $gte: 1 } } },
        { $sort: { avgRating: -1 } },
        { $limit: 5 },
      ]);

      console.log("[DEBUG] Aggregation Output Data:", popular);
      return res.json({
        recommendations: popular.map((p) => ({
          destination: p._id,
          score: p.avgRating ? p.avgRating.toFixed(1) : "0.0",
          reason: "Popular destination",
          ratedByCount: p.count,
        })),
        fallback: true,
      });
    }

    // 🚀 Data serialization & Clean up (Filter out rows with missing IDs)
    const formatted = allRatings
      .filter((r) => r.userId && r.cityId && r.rating !== undefined) // 👈 Security check: valid rows only
      .map((r) => ({
        user_id: r.userId.toString(),
        destination: r.cityId.toString(),
        rating: Number(r.rating),
      }));

    console.log(
      `[ML Pipeline] Dispatching ${formatted.length} vectors to Flask SVD service for User: ${targetUserId}`,
    );

    // 3. Call Flask ML service (Flask URL verification)
    // Note: Make sure Flask is running on port 5000 (or change port here if it's 5001)
    const url = `${process.env.ML_API_URL}/recommend`;
    const mlRes = await axios.post(
      url,
      {
        ratings: formatted,
        target_user: targetUserId,
      },
      { timeout: 10000 }, // 10 seconds timeout
    );

    return res.json({
      recommendations: mlRes.data.recommendations || mlRes.data,
      fallback: false,
    });
  } catch (err) {
    // 🔥 ENHANCED DEBUG LOGGING FOR AXIOS / NETWORK ERRORS
    console.error("❌ Recommendation controller pipeline failed!");

    if (err.response) {
      // Flask server responded with an error status (4xx, 5xx)
      console.error(`[Flask Error Status]: ${err.response.status}`);
      console.error(`[Flask Error Data]:`, err.response.data);
    } else if (err.request) {
      // Request was made but no response was received (Flask is likely DOWN)
      console.error(
        "[Network Error]: No response received from Flask server. Is it running on port 5000?",
      );
    } else {
      // Something else triggered the error
      console.error(`[Error Message]: ${err.message}`);
    }

    // Smooth error response to frontend
    return res.status(500).json({
      error: "Recommendation service temporarily offline",
      details:
        err.response?.data?.message || err.message || "Connection timeout",
    });
  }
};