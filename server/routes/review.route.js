import express from "express";
const router = express.Router();
import {
  addReview,
  getReviews,
  getRecomendPlaces,
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// Specific routes must be defined before dynamic routes (/:cityId)
router.get("/recommend", authMiddleware, getRecomendPlaces);
router.post("/:cityId", authMiddleware, addReview);
router.get("/:cityId", getReviews);
export default router;
