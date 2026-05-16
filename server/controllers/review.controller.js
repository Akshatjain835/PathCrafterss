import axios from "axios";
import Review from "../models/Review.js";

export const addReview = async (req, res) => {
  try {
    const { rating, comment, userName, tags } = req.body;
    const newReview = new Review({
      cityId: req.params.cityId,
      rating,
      comment,
      userName,
      tags,
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Failed to add review" });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ cityId: req.params.cityId }).sort({
      createdAt: -1,
    });
    res.json(reviews);
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};