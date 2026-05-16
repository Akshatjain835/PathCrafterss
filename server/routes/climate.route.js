// server/routes/climate.js
import express from "express";
const router = express.Router();
import DestinationClimate from "../models/DestinationClimate.js";
import {
  autoFetchClimate,
  isCacheStale,
} from "../controllers/climateAutoFetch.controller.js";
import { MONTH_NAMES } from "../utils/climateScorer.js";

router.get("/:destination", async (req, res) => {
  const { destination } = req.params;
  const { month } = req.query; // ?month=6  (from trip's planned month)
    //console.log("Requested climate for:", destination);
  try {
    let doc = await DestinationClimate.findOne({
      destination: new RegExp(`^${destination}$`, "i"),
    });
    // console.log(1);
    if (isCacheStale(doc)) {
        try {
          //console.log(2);
            doc = await autoFetchClimate(destination);
            console.log(3);
      } catch (err) {
        console.error("[Climate] Fetch failed:", err.message);
        if (!doc)
          return res.status(404).json({
            error: "Could not fetch climate data.",
            suggestion: "Try a nearby major city name.",
          });
      }
    }
    
    res.json({
      destination: doc.destination,
      country: doc.country,
      months: doc.months,
      bestMonths: doc.bestMonths,
      bestMonthNames: doc.bestMonths.map((m) => MONTH_NAMES[m - 1]),
      dataAge: doc.cachedAt
        ? `${Math.floor((Date.now() - doc.cachedAt) / 86400000)} days ago`
        : "fresh",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Climate service unavailable" });
  }
});

export default router;
