import axios from "axios";

const FALLBACK_IMAGE = "https://placehold.co/600x400/60a5fa/ffffff?text=Place";

const geocodeCity = async (city) => {
  const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY;
  if (!GEOAPIFY_KEY) throw new Error("GEOAPIFY_API_KEY is not set in .env");

  const res = await axios.get("https://api.geoapify.com/v1/geocode/search", {
    params: { text: city, type: "city", limit: 1, apiKey: GEOAPIFY_KEY },
  });
  const feature = res.data?.features?.[0];
  if (!feature) throw new Error(`Geocode returned no results for city: "${city}"`);
  const [lon, lat] = feature.geometry.coordinates;
  console.log(`[Geoapify] Geocoded "${city}" → lat=${lat}, lon=${lon}`);
  return { lat, lon };
};

const searchPlaces = async (lat, lon, categories, limit) => {
  const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY;
  const res = await axios.get("https://api.geoapify.com/v2/places", {
    params: {
      categories,
      filter: `circle:${lon},${lat},5000`,
      bias:   `proximity:${lon},${lat}`,
      limit,
      apiKey: GEOAPIFY_KEY,
    },
  });
  const features = res.data?.features || [];
  console.log(`[Geoapify] places query (${categories}) → ${features.length} results`);
  return features;
};

const normalise = (feature) => {
  const p = feature.properties;
  return {
    place_id: p.place_id,
    name:     p.name || p.address_line1 || "Unnamed place",
    address:  p.formatted || p.address_line2 || null,
    category: p.categories?.[0]?.replace(/_/g, " ") || null,
    cuisine:  p.datasource?.raw?.cuisine || null,
    website:  p.datasource?.raw?.website || null,
    phone:    p.datasource?.raw?.phone || p.datasource?.raw?.["contact:phone"] || null,
    opening:  p.datasource?.raw?.opening_hours || null,
    lat:      feature.geometry.coordinates[1],
    lon:      feature.geometry.coordinates[0],
    image:    FALLBACK_IMAGE,
  };
};

export const getCityRestaurants = async (req, res) => {
  const { city } = req.params;
  const limit = Math.min(Number(req.query.limit) || 9, 20);
  try {
    console.log(`[city] restaurants requested for: "${city}"`);
    const { lat, lon } = await geocodeCity(city);
    const features = await searchPlaces(lat, lon, "catering.restaurant,catering.cafe,catering.fast_food", limit);
    const data = features.filter((f) => f.properties?.name).map(normalise);
    console.log(`[city] returning ${data.length} restaurants`);
    return res.json({ data });
  } catch (err) {
    const status = err.response?.status;
    console.error(`[city] restaurants ERROR for "${city}":`, status, err.response?.data || err.message);
    if (status === 401) return res.status(500).json({ message: "Invalid Geoapify API key" });
    if (status === 429) return res.status(429).json({ message: "Geoapify rate limit hit" });
    return res.status(500).json({ message: err.message || "Failed to fetch restaurants" });
  }
};

export const getCityHotels = async (req, res) => {
  const { city } = req.params;
  const limit = Math.min(Number(req.query.limit) || 9, 20);
  try {
    console.log(`[city] hotels requested for: "${city}"`);
    const { lat, lon } = await geocodeCity(city);
    const features = await searchPlaces(lat, lon, "accommodation.hotel,accommodation.hostel,accommodation.guest_house", limit);
    const data = features.filter((f) => f.properties?.name).map(normalise);
    console.log(`[city] returning ${data.length} hotels`);
    return res.json({ data });
  } catch (err) {
    const status = err.response?.status;
    console.error(`[city] hotels ERROR for "${city}":`, status, err.response?.data || err.message);
    if (status === 401) return res.status(500).json({ message: "Invalid Geoapify API key" });
    if (status === 429) return res.status(429).json({ message: "Geoapify rate limit hit" });
    return res.status(500).json({ message: err.message || "Failed to fetch hotels" });
  }
};