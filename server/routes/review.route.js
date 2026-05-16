import express from "express";
const router = express.Router();
import { addReview, getReviews } from "../controllers/review.controller.js";

router.post("/:cityId", addReview);
router.get("/:cityId", getReviews);
export default router;