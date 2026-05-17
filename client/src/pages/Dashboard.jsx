import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/features/auth/authAPI";
import { MapPin, Trash2, X, Star, Clock, Sparkles } from "lucide-react";

const GENRES = [
  {
    id: "adventure",
    label: "Adventure",
    emoji: "🧗",
    color: "from-green-400 to-emerald-600",
    cities: [
      "Queenstown",
      "Patagonia",
      "Interlaken",
      "Banff",
      "Rishikesh",
      "Moab",
      "Innsbruck",
      "Kathmandu",
    ],
  },
  {
    id: "food",
    label: "Food & Culture",
    emoji: "🍜",
    color: "from-orange-400 to-red-500",
    cities: [
      "Tokyo",
      "Paris",
      "Mexico City",
      "Istanbul",
      "Lucknow",
      "New Orleans",
      "Naples",
      "Marrakech",
    ],
  },
  {
    id: "history",
    label: "History",
    emoji: "🏛️",
    color: "from-yellow-500 to-amber-600",
    cities: [
      "Rome",
      "Athens",
      "Cairo",
      "Kyoto",
      "Agra",
      "Cusco",
      "Petra",
      "Istanbul",
    ],
  },
  {
    id: "beach",
    label: "Beach",
    emoji: "🏖️",
    color: "from-sky-400 to-blue-600",
    cities: [
      "Bali",
      "Maldives",
      "Santorini",
      "Phuket",
      "Cancun",
      "Amalfi",
      "Seychelles",
      "Goa",
    ],
  },
  {
    id: "nature",
    label: "Nature",
    emoji: "🌿",
    color: "from-teal-400 to-green-600",
    cities: [
      "Patagonia",
      "Queenstown",
      "Costa Rica",
      "Iceland",
      "Munnar",
      "Amazon",
      "Zhangjiajie",
      "Yosemite",
    ],
  },
  {
    id: "spiritual",
    label: "Spiritual",
    emoji: "🕌",
    color: "from-purple-400 to-violet-600",
    cities: [
      "Varanasi",
      "Jerusalem",
      "Mecca",
      "Bodh Gaya",
      "Lhasa",
      "Kyoto",
      "Vatican City",
      "Haridwar",
    ],
  },
  {
    id: "romance",
    label: "Romantic",
    emoji: "💑",
    color: "from-pink-400 to-rose-600",
    cities: [
      "Paris",
      "Venice",
      "Santorini",
      "Bali",
      "Udaipur",
      "Prague",
      "Tuscany",
      "Maldives",
    ],
  },
  {
    id: "city",
    label: "City Life",
    emoji: "🌆",
    color: "from-slate-500 to-gray-700",
    cities: [
      "New York",
      "Tokyo",
      "London",
      "Dubai",
      "Singapore",
      "Sydney",
      "Barcelona",
      "Mumbai",
    ],
  },
  {
    id: "winter",
    label: "Snow & Winter",
    emoji: "❄️",
    color: "from-blue-300 to-cyan-600",
    cities: [
      "Lapland",
      "Reykjavik",
      "Aspen",
      "Zermatt",
      "Hokkaido",
      "Manali",
      "St. Moritz",
      "Quebec",
    ],
  },
  {
    id: "safari",
    label: "Wildlife & Safari",
    emoji: "🦁",
    color: "from-amber-500 to-yellow-700",
    cities: [
      "Serengeti",
      "Masai Mara",
      "Kruger",
      "Borneo",
      "Ranthambore",
      "Galapagos",
      "Amazon",
      "Sri Lanka",
    ],
  },
  {
    id: "road",
    label: "Road Trip",
    emoji: "🚗",
    color: "from-indigo-400 to-blue-600",
    cities: [
      "Route 66",
      "Amalfi Coast",
      "Great Ocean Road",
      "Leh-Manali",
      "Ring Road Iceland",
      "Pacific Coast Highway",
      "Scottish Highlands",
      "Patagonia",
    ],
  },
  {
    id: "luxury",
    label: "Luxury",
    emoji: "💎",
    color: "from-rose-400 to-pink-700",
    cities: [
      "Dubai",
      "Monaco",
      "Maldives",
      "Bora Bora",
      "Amalfi",
      "Seychelles",
      "St. Barts",
      "Mykonos",
    ],
  },
];

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const navigate = useNavigate();

  // 🚨 AI Recommendations States
  const [recs, setRecs] = useState([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const [fallback, setFallback] = useState(false);

  // Helper to accurately determine trip status relative to today
  const getTripStatus = (startDate, endDate) => {
    if (!startDate || !endDate) return "UPCOMING";

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return "UPCOMING";

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      if (today >= start && today <= end) return "CONTINUING";
      if (today > end) return "COMPLETED";
      return "UPCOMING";
    } catch (err) {
      console.error("Trip status error:", err);
      return "UPCOMING";
    }
  };

  const deleteTrip = async (id) => {
    try {
      await api.delete(`/api/trips/${id}`);
      setTrips((prev) => prev.filter((trip) => trip._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    // 1. Fetch user specific planned trips
    const fetchTrips = async () => {
      try {
        const res = await api.get("/api/trips");
        setTrips(res.data);
      } catch (err) {
        console.error("Fetch trips failed:", err);
      }
    };

    // 🚨 2. Fetch AI Recommendations via authenticated api wrapper
    const fetchAIRecommendations = async () => {
      try {
        const res = await api.get("/api/reviews/recommend");
        console.log("AI Recommendations response:", res.data);
        setRecs(
          res.data.recommendations || (Array.isArray(res.data) ? res.data : []),
        );
        setFallback(res.data.fallback || false);
      } catch (err) {
        console.error("Fetch AI recommendations failed:", err);
      } finally {
        setRecsLoading(false);
      }
    };

    fetchTrips();
    fetchAIRecommendations();
  }, []);

  const selectedGenre = GENRES.find((g) => g.id === activeGenre);

  return (
    <div className="max-w-7xl mx-auto space-y-12 p-4">
      {/* ================= OPTION 2: AI RECOMMENDATIONS PIPELINE ================= */}
      <div className="bg-gradient-to-r from-slate-50 to-sky-50/50 p-6 rounded-3xl border border-sky-100/60">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles
            className="text-amber-500 fill-amber-500 animate-spin-slow"
            size={20}
          />
          <h2 className="text-2xl font-bold text-gray-800">
            Discover Next Places
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          {fallback
            ? "💡 Popular destinations worldwide — rate more cities to get tailored predictions!"
            : "🎯 Personalized for you — based on your travel history and community patterns."}
        </p>

        {recsLoading ? (
          <div className="text-center py-8 text-sky-600 font-medium animate-pulse flex items-center justify-center gap-2">
            <Clock size={16} className="animate-spin" /> Finding trips you'll
            love...
          </div>
        ) : recs.length === 0 ? (
          <div className="text-center py-8 bg-white border border-dashed rounded-2xl border-gray-200">
            <p className="text-gray-500 text-sm">
              No recommendations available. Rate at least 2 destinations to
              kickstart the prediction pipeline!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {recs.map((rec, i) => {
              const scorePercent = Math.round((rec.score / 5) * 100);
              return (
                <div
                  key={i}
                  onClick={() => navigate(`/city/${rec.destination}`)}
                  className="group cursor-pointer bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      #{i + 1} Best Match
                    </span>
                    <h3 className="text-base font-bold text-gray-800 group-hover:text-sky-600 transition-colors truncate mb-2">
                      {rec.destination}
                    </h3>

                    {/* Performance Score Bar */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${scorePercent}%`,
                          backgroundColor:
                            scorePercent >= 80
                              ? "#1D9E75"
                              : scorePercent >= 60
                              ? "#BA7517"
                              : "#D85A30",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <Star size={12} fill="currentColor" /> {rec.score}★{" "}
                      <span className="text-[10px] text-gray-400 font-normal">
                        match
                      </span>
                    </div>
                    {rec.ratedByCount !== undefined && (
                      <span className="text-[10px] text-gray-400">
                        👥 Verified by {rec.ratedByCount} visitors
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= SECTION: EXPLORE VIBES ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-1">Explore by Interest</h2>
        <p className="text-sm text-gray-400 mb-5">
          Not sure where to go? Pick a vibe and discover destinations around the
          world.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() =>
                setActiveGenre(activeGenre === genre.id ? null : genre.id)
              }
              className={`rounded-2xl p-4 flex flex-col items-center gap-2 text-white font-medium text-sm
                bg-gradient-to-br ${
                  genre.color
                } shadow hover:scale-105 transition-transform
                ${
                  activeGenre === genre.id
                    ? "ring-4 ring-offset-2 ring-white shadow-xl scale-105"
                    : ""
                }`}
            >
              <span className="text-3xl">{genre.emoji}</span>
              <span className="text-center leading-tight">{genre.label}</span>
            </button>
          ))}
        </div>

        {selectedGenre && (
          <div className="mt-4 border rounded-2xl bg-white shadow-sm p-5 relative">
            <button
              onClick={() => setActiveGenre(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>

            <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-xl">{selectedGenre.emoji}</span>
              Popular {selectedGenre.label} destinations worldwide
            </p>

            <div className="flex flex-wrap gap-3">
              {selectedGenre.cities.map((city) => (
                <button
                  key={city}
                  onClick={() => navigate(`/city/${city}`)}
                  className={`px-4 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r ${selectedGenre.color} hover:opacity-90 shadow-sm transition`}
                >
                  📍 {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= SECTION: MY PLANNED TRIPS ================= */}
      <div>
        <h1 className="text-2xl font-bold mb-6">My Trips</h1>

        {trips.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed">
            <p className="text-gray-500">
              No trips saved yet. Start exploring to plan one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
              const startDate = trip.startDate;
              const endDate = trip.endDate;
              const status = getTripStatus(startDate, endDate);
              const cityName =
                trip.destination?.city || trip.destination || "Unknown City";
              const countryName = trip.destination?.country || "";

              return (
                <div
                  key={trip._id}
                  onClick={() => navigate(`/trip/${trip._id}`)}
                  className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden relative flex flex-col justify-between"
                >
                  <div className="relative w-full h-44 bg-sky-50 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                    <div className="absolute top-4 left-4 z-[999] flex gap-2">
                      {status === "UPCOMING" && (
                        <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          UPCOMING
                        </div>
                      )}
                      {status === "CONTINUING" && (
                        <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse shadow-lg">
                          <Clock size={12} /> LIVE NOW
                        </div>
                      )}
                      {status === "COMPLETED" && (
                        <div className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          PAST TRIP
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTrip(trip._id);
                      }}
                      className="absolute top-3 right-3 z-30 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>

                    <MapPin size={48} className="text-sky-600 opacity-80" />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 truncate mb-1">
                        {trip.title || `Trip to ${cityName}`}
                      </h2>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        {cityName}
                        {countryName && `, ${countryName}`}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-5">
                      <span className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        {trip.days?.length || 0} DAYS
                      </span>

                      {status === "COMPLETED" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/city/${cityName}?review=true`);
                          }}
                          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 px-4 py-2 rounded-xl transition-all border border-blue-100"
                        >
                          <Star size={12} fill="currentColor" /> Add Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
