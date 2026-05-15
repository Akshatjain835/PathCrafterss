// server/cron/refreshClimate.js
import cron from "node-cron";
import DestinationClimate from "../models/DestinationClimate.js";
import { autoFetchClimate } from "../controllers/climateAutoFetch.controller.js";

// Every Sunday at 2am — silently refreshes stale cache
cron.schedule("0 2 * * 0", async () => {
  console.log("[Cron] Starting climate cache refresh...");
  const cutoff = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000);
  const stale = await DestinationClimate.find({ cachedAt: { $lt: cutoff } })
    .select("destination")
    .limit(50);

  for (const dest of stale) {
    try {
      await autoFetchClimate(dest.destination);
      await new Promise((r) => setTimeout(r, 1200)); // rate limit buffer
    } catch (err) {
      console.error(`[Cron] Failed ${dest.destination}:`, err.message);
    }
  }
  console.log(`[Cron] Refreshed ${stale.length} destinations.`);
});
