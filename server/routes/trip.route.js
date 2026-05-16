import express from "express";
import {
  createTrip,
  getTripById,
  addActivity,
  getExploreData,
  getAttractionDetail,
  getUserTrips,
  saveTrip,
  deleteTrip,
  shareTrip,
  unshareTrip,
  getSharedTrip,
} from "../controllers/trip.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create",                      authMiddleware, createTrip);
router.get("/",                             authMiddleware, getUserTrips);
router.get("/shared/:token",                               getSharedTrip);   // ← public, no auth
router.get("/:tripId",                      authMiddleware, getTripById);
router.post("/:tripId/add-activity",        authMiddleware, addActivity);
router.get("/:tripId/explore",                             getExploreData);
router.get("/:tripId/attraction/:locationId",              getAttractionDetail);
router.put("/:tripId/save",                 authMiddleware, saveTrip);
router.post("/:tripId/share",               authMiddleware, shareTrip);
router.post("/:tripId/unshare",             authMiddleware, unshareTrip);
router.delete("/:id",                       authMiddleware, deleteTrip);

export default router;