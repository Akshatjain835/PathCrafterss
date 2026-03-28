import express from "express";
import { generateItinerary } from "../controllers/ai.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/ai/generate-itinerary
router.post("/generate-itinerary", authMiddleware, generateItinerary);

export default router;