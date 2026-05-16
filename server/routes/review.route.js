import express from "express";
const router = express.Router();
import { addReview, getReviews } from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

router.post("/:cityId", authMiddleware,addReview);
router.get("/:cityId", getReviews);
export default router;