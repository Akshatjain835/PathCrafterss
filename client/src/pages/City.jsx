import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCityInfo, fetchCityImages } from "../features/auth/citySlice";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ImageSlideshow from "../components/SlideShow";
import TouristAttractions from "./TouristAttraction";
import { createTrip } from "@/features/auth/authTrip";
import { toast } from "sonner";
import BestTimeToVisit from "../components/BestTimeToVisit";
import ReviewSection from "@/components/ReviewSection";

const CityPage = () => {
  const { city } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const { info, images, loading, error } = useSelector((s) => s.city);

  // Reference for the Review Section to allow auto-scrolling
  const reviewRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCityInfo(city));
    dispatch(fetchCityImages(city));
  }, [city, dispatch]);

  // Logic to check if user was redirected here to add a review
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const shouldReview = searchParams.get("review");

    if (shouldReview === "true" && reviewRef.current) {
      setTimeout(() => {
        reviewRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 500);
    }
  }, [location.search, loading]);

  const handlePlanTrip = async () => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    if (!info) return;

    try {
      const res = await createTrip({
        city: info.title || city,
        country: info.location_string?.split(",").pop().trim() || "India",
      });

      navigate(`/trip/${res.data.tripId}`);
    } catch (err) {
      console.error("Failed to create trip", err);
      toast.error("Could not create trip. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="animate-pulse text-sky-600 font-medium">
          Loading {city}...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center">
        <p className="text-red-600 font-bold">Error: {error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sky-600 underline"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-10">
      {/* --- Top Section: Main Info & Visuals --- */}
      <section>
        <div className="flex flex-col md:flex-row gap-8">
          {/* --- Left Column: Visuals --- */}
          <div className="md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
            {images?.length > 0 ? (
              <ImageSlideshow images={images} />
            ) : (
              <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                No images available
              </div>
            )}
          </div>

          {/* --- Right Column: Info --- */}
          <div className="md:w-1/2 flex flex-col justify-center">
            {info && (
              <>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                  {info.title}
                </h1>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {info.extract}
                </p>

                <div className="mt-8">
                  <button
                    onClick={handlePlanTrip}
                    className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    Start Planning a Trip
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* --- Climate Section --- */}
      <section className="bg-gray-50 p-4 rounded-2xl">
        <h2 className="text-xl font-bold mb-4 px-1">Best Time to Visit</h2>
        <BestTimeToVisit destination={city} />
      </section>

      {/* --- Attractions Section --- */}
      <section>
        <h2 className="text-xl font-bold mb-4 px-1">Top Tourist Attractions</h2>
        <TouristAttractions city={city} />
      </section>

      {/* --- Review Section --- */}
      <section ref={reviewRef} className="pt-8 border-t border-gray-100">
        <ReviewSection cityId={city} />
      </section>
    </div>
  );
};

export default CityPage;
