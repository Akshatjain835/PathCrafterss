/**
 * debug_places.mjs
 * Run this BEFORE starting your server to confirm the API is working.
 *
 * Usage:
 *   GEOAPIFY_API_KEY=your_key_here node debug_places.mjs
 *   OR (if you have a .env file):
 *   node --env-file=.env debug_places.mjs
 *
 * What it tests, step by step:
 *   1. Is GEOAPIFY_API_KEY set?
 *   2. Can we geocode a city name to lat/lon?
 *   3. Can we fetch restaurants near that city?
 *   4. Can we fetch hotels near that city?
 *   5. Can we fetch restaurants for the ACTUAL city your app uses?
 */

import axios from "axios";

const KEY  = process.env.GEOAPIFY_API_KEY;
const TEST_CITY = process.argv[2] || "Tokyo"; // pass your own city: node debug_places.mjs Paris

// ─── helpers ─────────────────────────────────────────────────────────────────
const ok  = (msg) => console.log(`  ✅  ${msg}`);
const err = (msg) => console.log(`  ❌  ${msg}`);
const sep = ()    => console.log("\n" + "─".repeat(55));

// ─── STEP 1: key check ───────────────────────────────────────────────────────
sep();
console.log("STEP 1 — Environment variable");
if (!KEY || KEY === "your_key_here") {
  err("GEOAPIFY_API_KEY is missing or still set to placeholder.");
  console.log(`
  Fix: add this to server/.env
      GEOAPIFY_API_KEY=paste_your_key_here

  Then run:  node --env-file=.env debug_places.mjs
  `);
  process.exit(1);
}
ok(`GEOAPIFY_API_KEY is set  (starts with: ${KEY.slice(0, 6)}...)`);

// ─── STEP 2: geocode ─────────────────────────────────────────────────────────
sep();
console.log(`STEP 2 — Geocode city: "${TEST_CITY}"`);
let lat, lon;
try {
  const res = await axios.get("https://api.geoapify.com/v1/geocode/search", {
    params: { text: TEST_CITY, type: "city", limit: 1, apiKey: KEY },
  });
  const feature = res.data?.features?.[0];
  if (!feature) throw new Error("No features returned — city not found.");
  [lon, lat] = feature.geometry.coordinates;
  const label = feature.properties?.formatted || feature.properties?.city;
  ok(`Resolved to: ${label}`);
  ok(`Coordinates: lat=${lat}, lon=${lon}`);
} catch (e) {
  err(`Geocode failed: ${e.response?.status} — ${e.response?.data?.message || e.message}`);
  if (e.response?.status === 401) {
    console.log("\n  → Your API key is invalid. Double-check it at myprojects.geoapify.com");
  }
  process.exit(1);
}

// ─── STEP 3: restaurants ─────────────────────────────────────────────────────
sep();
console.log("STEP 3 — Fetch restaurants");
try {
  const res = await axios.get("https://api.geoapify.com/v2/places", {
    params: {
      categories: "catering.restaurant,catering.cafe,catering.fast_food",
      filter:     `circle:${lon},${lat},5000`,
      bias:       `proximity:${lon},${lat}`,
      limit:      5,
      apiKey:     KEY,
    },
  });
  const features = res.data?.features || [];
  if (features.length === 0) {
    err("API responded but returned 0 restaurants. Possibly a very small city or wrong coordinates.");
  } else {
    ok(`Got ${features.length} restaurants`);
    features.slice(0, 3).forEach((f, i) => {
      const p = f.properties;
      console.log(`     ${i + 1}. ${p.name || "(no name)"} — ${p.formatted || ""}`);
    });
  }
} catch (e) {
  err(`Restaurants failed: ${e.response?.status} — ${e.response?.data?.message || e.message}`);
  if (e.response?.status === 429) console.log("\n  → Rate limit hit. You're over 3,000 req/day on the free plan.");
}

// ─── STEP 4: hotels ──────────────────────────────────────────────────────────
sep();
console.log("STEP 4 — Fetch hotels");
try {
  const res = await axios.get("https://api.geoapify.com/v2/places", {
    params: {
      categories: "accommodation.hotel,accommodation.hostel,accommodation.guest_house",
      filter:     `circle:${lon},${lat},5000`,
      bias:       `proximity:${lon},${lat}`,
      limit:      5,
      apiKey:     KEY,
    },
  });
  const features = res.data?.features || [];
  if (features.length === 0) {
    err("API responded but returned 0 hotels.");
    console.log("  → Try increasing radius. Some cities may need 10000 (10 km).");
  } else {
    ok(`Got ${features.length} hotels`);
    features.slice(0, 3).forEach((f, i) => {
      const p = f.properties;
      console.log(`     ${i + 1}. ${p.name || "(no name)"} — ${p.formatted || ""}`);
    });
  }
} catch (e) {
  err(`Hotels failed: ${e.response?.status} — ${e.response?.data?.message || e.message}`);
}

// ─── STEP 5: check the backend route is reachable (optional) ─────────────────
sep();
console.log("STEP 5 — Test your backend route (server must be running)");
try {
  const res = await axios.get(
    `http://localhost:5000/api/city/${encodeURIComponent(TEST_CITY)}/restaurants`,
    { timeout: 5000 }
  );
  const count = res.data?.data?.length ?? 0;
  ok(`Backend route responded — got ${count} restaurants`);
} catch (e) {
  if (e.code === "ECONNREFUSED") {
    console.log("  ⚠️  Server not running — that's fine, steps 1–4 are what matter.");
  } else {
    err(`Backend route error: ${e.response?.status} — ${JSON.stringify(e.response?.data)}`);
  }
}

sep();
console.log("\nDone. Fix any ❌ above before starting your server.\n");
