import crypto from "crypto";
import Trip from "../models/auth.trip.js";
import axios from "axios";

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "travel-advisor.p.rapidapi.com";

export const createTrip = async (req, res) => {
  try {
    const { destination } = req.body;
    const trip = await Trip.create({
      title: `Trip to ${destination.city}`,
      destination,
      days: [],
      userId: req.user.id,
      isSaved: false,
    });

    res.status(201).json({ tripId: trip._id });
  } catch (err) {
    res.status(500).json({ message: "Failed to create trip" });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    res.json(trip);
  } catch (err) {
    res.status(404).json({ message: "Trip not found" });
  }
};

export const getExploreData = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const { city } = trip.destination;

    // ---- Unsplash: city image fallback ----
    const unsplashRes = await axios.get(
      "https://api.unsplash.com/search/photos",
      {
        params: { query: city, per_page: 1 },
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
      },
    );
    const cityImage = unsplashRes.data.results[0]?.urls?.regular;

    // ---- RapidAPI: attractions ----
    const options = {
      method: "GET",
      url: `https://${RAPIDAPI_HOST}/locations/v2/auto-complete`,
      params: { query: city, lang: "en" },
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
    };

    const response = await axios.request(options);

    const attractions =
      response.data?.data?.Typeahead_autocomplete?.results?.map((item) => ({
        id: item?.details?.location_id || item?.location_id,
        name: item?.details?.name || item?.name,
        description: item?.details?.subcategory?.name || "No description",
        lat: item?.details?.latitude || 0,
        lng: item?.details?.longitude || 0,
        image:
          item?.details?.photo?.images?.large?.url ||
          cityImage ||
          "https://via.placeholder.com/400",
      })) || [];

    res.json(attractions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch attractions" });
  }
};

export const getAttractionDetail = async (req, res) => {
  try {
    const { locationId } = req.params;

    const options = {
      method: "GET",
      url: `https://${RAPIDAPI_HOST}/attractions/get-details`,
      params: { location_id: locationId, lang: "en" },
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
    };

    const response = await axios.request(options);
    const data = response.data;

    const attraction = {
      id: data.location_id,
      name: data.name,
      description: data.subcategory?.name || "No description",
      address:
        data.address_obj?.street || data.address_obj?.city || "No address",
      image:
        data.photo?.images?.large?.url || "https://via.placeholder.com/400",
      rating: data.rating,
      num_reviews: data.num_reviews,
      lat: data.latitude,
      lng: data.longitude,
    };

    res.json(attraction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch attraction detail" });
  }
};

export const addActivity = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { name, type, lat, lng, dayNumber, time } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    let day = trip.days.find((d) => d.dayNumber === dayNumber);
    if (!day) {
      day = { dayNumber, activities: [] };
      trip.days.push(day);
    }

    day.activities.push({ name, type, lat, lng, time });

    await trip.save();
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add activity" });
  }
};

export const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id, isSaved: true }).sort({
      updatedAt: -1,
    });

    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};

export const saveTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.tripId, userId: req.user.id },
      {
        ...req.body,
        isSaved: true,
      },
      { new: true },
    );
    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or unauthorized" });
    }

    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save trip" });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================= SHARE TRIP =========================
export const shareTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: "Trip not found or unauthorized" });

    // Generate a unique token if not already shared
    if (!trip.shareToken) {
      trip.shareToken = crypto.randomBytes(16).toString("hex");
    }
    trip.isPublic = true;
    await trip.save();

    const shareUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/shared/${trip.shareToken}`;
    return res.json({ shareUrl, shareToken: trip.shareToken });
  } catch (err) {
    console.error("shareTrip error:", err.message);
    res.status(500).json({ message: "Failed to generate share link" });
  }
};

// ========================= UNSHARE TRIP =========================
export const unshareTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.tripId, userId: req.user.id },
      { isPublic: false, shareToken: null },
      { new: true }
    );
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    return res.json({ message: "Trip is now private" });
  } catch (err) {
    res.status(500).json({ message: "Failed to unshare trip" });
  }
};

// ========================= GET SHARED TRIP (public, no auth) =========================
export const getSharedTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ shareToken: req.params.token, isPublic: true });
    if (!trip) return res.status(404).json({ message: "Trip not found or link has expired" });
    return res.json(trip);
  } catch (err) {
    res.status(500).json({ message: "Failed to load shared trip" });
  }
};