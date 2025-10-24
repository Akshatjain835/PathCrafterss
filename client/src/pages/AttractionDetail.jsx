import React, { useEffect,useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttractionDetail} from "../features/auth/citySlice";

// A fallback image in case the API doesn't provide one
const FALLBACK_IMAGE =
  "https://placehold.co/1200x600/60a5fa/ffffff?text=Attraction";

const AttractionDetail = () => {
  const { locationId } = useParams();
  const dispatch = useDispatch();

  // Get the new state properties from the Redux store
  const [loading, setLoading] = useState(true);
  const [attraction, setAttraction] = useState(null);

  // Fetch the details when the component loads or locationId changes
  useEffect(() => {
    if (locationId) {
      dispatch(fetchAttractionDetail(locationId)).then((data) => {
        if (data?.meta?.requestStatus == "fulfilled") {
          console.log("data ", data.payload);
          
          setAttraction(data.payload);
          setLoading(false);
        }
      })
    }
  }, [locationId, dispatch]);

  // Handle Loading state
  if (loading) {
    return <div className="p-8 text-center">Loading attraction details...</div>;
  }

  

  // Handle case where data hasn't loaded yet
  if (!attraction) {
    return <div className="p-8 text-center">No attraction data found.</div>;
  }

  // Once data is loaded, render the details
  const imageUrl = attraction.photo?.images?.large?.url || FALLBACK_IMAGE;

  return (
    <div className="max-w-4xl mx-auto p-4 my-8">
      {/* Back link */}
      <Link
        to={-1} // This is a handy trick to go back to the previous page
        className="text-sky-600 hover:underline mb-4 inline-block"
      >
        &larr; Back to city
      </Link>

      {/* Main Image */}
      <img
        src={imageUrl}
        alt={attraction.name}
        className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        onError={(e) => {
          e.target.src = FALLBACK_IMAGE;
        }}
      />

      {/* Header: Title + TripAdvisor Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6">
        <h1 className="text-4xl font-bold text-gray-900">{attraction.name}</h1>
      </div>

      {/* Rating & Review Count */}
      <div className="flex items-center space-x-4 mt-4 text-gray-700">
        {attraction.rating && (
          <span className="text-lg font-bold text-yellow-500">
            ★ {attraction.rating}
          </span>
        )}
        {attraction.num_reviews && (
          <span>({attraction.num_reviews} reviews)</span>
        )}
      </div>

      {/* Description ("Why it's famous") */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">About</h2>
        <p className="text-gray-800 leading-relaxed">
          {attraction.description || "No description available."}
        </p>
      </div>

      {/* Address */}
      {attraction.address_obj && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Location</h2>
          <p className="text-gray-800">
            {attraction.location_string}
          </p>
        </div>
      )}
    </div>
  );
};

export default AttractionDetail;
