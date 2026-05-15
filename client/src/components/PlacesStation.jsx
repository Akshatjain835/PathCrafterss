import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCityRestaurants, fetchCityHotels } from "../features/auth/citySlice";
import { Star, MapPin, Phone, ExternalLink, Utensils, Hotel } from "lucide-react";

const TABS = [
  { id: "restaurants", label: "Restaurants", icon: Utensils },
  { id: "hotels",      label: "Hotels",      icon: Hotel },
];

const FALLBACK = "https://placehold.co/600x400/60a5fa/ffffff?text=Place";

// ─── Star rating strip ────────────────────────────────────────────────────────
const Stars = ({ rating }) => {
  if (!rating) return null;
  const full = Math.round(Number(rating));
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={12}
          className={n <= full ? "fill-amber-400 text-amber-400" : "text-gray-300"}
        />
      ))}
      <span className="ml-1 text-xs text-gray-500">
        {rating}{" "}
        {/* num_reviews */}
        {/* shown below */}
      </span>
    </span>
  );
};

// ─── Single place card ────────────────────────────────────────────────────────
const PlaceCard = ({ place, type }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        <img
          src={imgError ? FALLBACK : place.image}
          alt={place.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
        {/* price badge */}
        {place.price_level && (
          <span className="absolute top-2 right-2 bg-white/90 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
            {place.price_level}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow gap-2">
        {/* name */}
        <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2">
          {place.name}
        </h3>

        {/* rating */}
        <div className="flex items-center gap-2">
          <Stars rating={place.rating} />
          {place.num_reviews && (
            <span className="text-xs text-gray-400">({place.num_reviews} reviews)</span>
          )}
        </div>

        {/* cuisine / category tag */}
        {(place.cuisine || place.category) && (
          <span className="text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full self-start">
            {place.cuisine || place.category}
          </span>
        )}

        {/* address */}
        {place.address && (
          <p className="flex items-start gap-1 text-xs text-gray-500 mt-auto">
            <MapPin size={12} className="mt-0.5 shrink-0 text-gray-400" />
            <span className="line-clamp-2">{place.address}</span>
          </p>
        )}

        {/* phone */}
        {place.phone && (
          <p className="flex items-center gap-1 text-xs text-gray-500">
            <Phone size={12} className="shrink-0 text-gray-400" />
            {place.phone}
          </p>
        )}

        {/* TripAdvisor link */}
        {place.web_url && (
          <a
            href={place.web_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 text-sm font-medium"
          >
            View on TripAdvisor
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const PlacesSection = ({ city }) => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("restaurants");
  const [state, setState] = useState({
    restaurants: { data: [], loading: false, loaded: false, error: null },
    hotels:      { data: [], loading: false, loaded: false, error: null },
  });

  // Lazy-load: only fetch when the tab is first visited
  useEffect(() => {
    if (state[activeTab].loaded || state[activeTab].loading) return;

    setState((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], loading: true, error: null },
    }));

    const thunk =
      activeTab === "restaurants" ? fetchCityRestaurants : fetchCityHotels;

    dispatch(thunk(city)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        setState((prev) => ({
          ...prev,
          [activeTab]: { data: action.payload, loading: false, loaded: true, error: null },
        }));
      } else {
        setState((prev) => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            loading: false,
            loaded: true,
            error: action.payload || "Something went wrong.",
          },
        }));
      }
    });
  }, [activeTab, city, dispatch]);

  const { data = [], loading, error } = state[activeTab];

  return (
    <section className="my-10">
      {/* Section header */}
      <h2 className="text-3xl font-bold mb-5">Eat &amp; Stay</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors
              ${activeTab === id
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} />)}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-base">{error}</p>
          <p className="text-sm mt-1">Try refreshing the page.</p>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No {activeTab} found for {city}.</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((place) => (
            <PlaceCard key={place.location_id} place={place} type={activeTab} />
          ))}
        </div>
      )}
    </section>
  );
};

export default PlacesSection;