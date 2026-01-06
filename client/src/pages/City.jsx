import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCityInfo, fetchCityImages } from "../features/auth/citySlice";
import { useParams } from "react-router-dom";
import ImageSlideshow from "../components/SlideShow";
import TouristAttractions from "./TouristAttraction";
import { useNavigate } from "react-router-dom";
import { createTrip } from "@/features/auth/authTrip";
import { toast } from "sonner";

const CityPage = () => {
  const { city } = useParams();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { info, images, loading, error } = useSelector((s) => s.city);

  const navigate = useNavigate();

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
    }
  };
  useEffect(() => {
    dispatch(fetchCityInfo(city));
    dispatch(fetchCityImages(city));
  }, [city, dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <div>
        <div className="flex flex-col md:flex-row gap-4">
          {/* --- Left Column --- */}
          <div className="md:w-1/2">
            {images?.length > 0 ? <ImageSlideshow images={images} /> : null}
          </div>

          {/* --- Right Column --- */}
          <div className="md:w-1/2">
            {info && (
              <>
                <h1 className="text-2xl font-bold">{info.title}</h1>
                <p className="mt-2">{info.extract}</p>
              </>
            )}
          </div>
        </div>
        <div>
          <TouristAttractions city={city} />
        </div>
      </div>
      <button
        onClick={handlePlanTrip}
        className="mt-6 px-4 py-2 bg-sky-600 text-white rounded-md"
      >
        Plan Trip
      </button>
    </div>
  );
};

export default CityPage;
