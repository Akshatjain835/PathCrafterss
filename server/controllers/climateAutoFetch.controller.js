import axios from "axios";
import DestinationClimate from "../models/DestinationClimate.js";
import { scoreMonth, getWarnings } from "../utils/climateScorer.js";

const CACHE_DAYS = 30;

async function geocodeDestination(name) {
  const res = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
    params: {
      q: name,
      key: process.env.OPENCAGE_API_KEY,
      limit: 1,
      no_annotations: 1,
    },
  });
  if (!res.data.results.length) throw new Error(`Cannot geocode: ${name}`);
  const { lat, lng } = res.data.results[0].geometry;
  const country = res.data.results[0].components.country || "";
  return { lat, lon: lng, country };
}

async function fetchClimateData(lat, lon) {
  const res = await axios.get("https://archive-api.open-meteo.com/v1/archive", {
    params: {
      latitude: lat,
      longitude: lon,
      start_date: "2025-01-01",
      end_date: "2025-12-31",
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
      timezone: "auto",
    },
  });

  const daily = res.data.daily;

  if (!daily || !daily.time) {
    throw new Error("Invalid climate API response");
  }

  // Convert daily → monthly averages
  const monthlyMap = {};

  daily.time.forEach((date, i) => {
    const month = new Date(date).getMonth() + 1;

    if (!monthlyMap[month]) {
      monthlyMap[month] = {
        month,
        maxTemps: [],
        minTemps: [],
        rainfalls: [],
      };
    }

    monthlyMap[month].maxTemps.push(daily.temperature_2m_max[i]);
    monthlyMap[month].minTemps.push(daily.temperature_2m_min[i]);
    monthlyMap[month].rainfalls.push(daily.precipitation_sum[i]);
  });

  return Object.values(monthlyMap).map((m) => ({
    month: m.month,
    avgTempMax: Math.round(
      m.maxTemps.reduce((a, b) => a + b, 0) / m.maxTemps.length,
    ),
    avgTempMin: Math.round(
      m.minTemps.reduce((a, b) => a + b, 0) / m.minTemps.length,
    ),
    rainfallMM: Math.round(m.rainfalls.reduce((a, b) => a + b, 0)),
  }));
}

async function fetchCrowdData(destinationName) {
  const wikiName = destinationName.replace(/ /g, "_");
  const year = new Date().getFullYear() - 1;
  try {
    const res = await axios.get(
      `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${wikiName}/monthly/${year}0101/${year}1201`,
      { headers: { "User-Agent": "PathCrafters/1.0" } },
    );
    const views = res.data.items.map((item) => item.views);
    const maxViews = Math.max(...views);
    const minViews = Math.min(...views);
    return views.map((v, i) => ({
      month: i + 1,
      crowdScore:
        maxViews === minViews
          ? 5
          : Math.round(1 + ((v - minViews) / (maxViews - minViews)) * 9),
    }));
  } catch {
    return Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      crowdScore: 5,
    }));
  }
}

function buildMonthData(climateMonths, crowdMonths) {
  return climateMonths.map((c) => {
    const crowd = crowdMonths.find((cr) => cr.month === c.month);
    const crowdScore = crowd?.crowdScore || 5;
    const crowdLevel =
      crowdScore >= 9
        ? "very_high"
        : crowdScore >= 7
          ? "high"
          : crowdScore >= 4
            ? "moderate"
            : "low";
    const monthData = { ...c, crowdScore, crowdLevel };
    return {
      ...monthData,
      score: scoreMonth(monthData),
      warnings: getWarnings(monthData),
    };
  });
}

async function autoFetchClimate(destinationName) {
    //console.log(`[Climate] Fetching: ${destinationName}`);
    //console.log(3);
    const { lat, lon, country } = await geocodeDestination(destinationName);
  //console.log(4);
  
  const [climateMonths, crowdMonths] = await Promise.all([
    fetchClimateData(lat, lon),
    fetchCrowdData(destinationName),
  ]);


    //console.log(5);
  const months = buildMonthData(climateMonths, crowdMonths);
  const maxScore = Math.max(...months.map((m) => m.score));
  const bestMonths = months
    .filter((m) => m.score >= maxScore - 15 && m.score >= 60)
    .map((m) => m.month);
  const doc = await DestinationClimate.findOneAndUpdate(
    { destination: new RegExp(`^${destinationName}$`, "i") },
    {
      destination: destinationName,
      lat,
      lon,
      country,
      months,
      bestMonths,
      cachedAt: new Date(),
      autoFetched: true,
    },
    { upsert: true, new: true },
  );
  console.log(`[Climate] Saved ${destinationName} — best: ${bestMonths}`);
  return doc;
}

function isCacheStale(doc) {
  if (!doc || !doc.cachedAt) return true;
  return (Date.now() - doc.cachedAt) / (1000 * 60 * 60 * 24) > CACHE_DAYS;
}

export { autoFetchClimate, isCacheStale };
