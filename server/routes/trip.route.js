import express from "express";
import {
  createTrip,
  getTripById,
  addActivity,
  getExploreData,
  getAttractionDetail,
  getUserTrips,
  saveTrip,
  deleteTrip
} from "../controllers/trip.controller.js";
import authTrip from "../models/auth.trip.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/create", authMiddleware,createTrip);
router.get("/:tripId",authMiddleware, getTripById);
router.post("/:tripId/add-activity", authMiddleware, addActivity);
router.get("/:tripId/explore", getExploreData);
router.get("/:tripId/attraction/:locationId", getAttractionDetail);
router.get("/", authMiddleware, getUserTrips);
router.put("/:tripId/save", authMiddleware, saveTrip);
router.delete("/:id", authMiddleware, deleteTrip);
export default router;
