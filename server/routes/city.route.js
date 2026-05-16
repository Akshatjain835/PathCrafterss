import express from "express";
import { getCityRestaurants, getCityHotels, getCityAttractions } from "../controllers/city.controller.js";

const router = express.Router();

// GET /api/city/:city/restaurants?limit=9
router.get("/:city/restaurants", getCityRestaurants);

// GET /api/city/:city/hotels?limit=9
router.get("/:city/hotels", getCityHotels);

// GET /api/city/:city/attractions
router.get("/:city/attractions", getCityAttractions);

export default router;