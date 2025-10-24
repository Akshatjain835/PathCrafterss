import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCityAttractions } from "../features/auth/citySlice";

// A placeholder image to use if the API doesn't provide one
const FALLBACK_IMAGE =
  "https://placehold.co/600x400/34d399/ffffff?text=Attraction";

const TouristAttractions = ({ city }) => {
  const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(true);
  // We'll set up these new state variables in our slice
//   const { attractions, attractionsLoading, attractionsError } = useSelector(
//     (s) => s.city
    //   );
    const [attractions, setAttractions] = useState([]);

    useEffect(() => {
      
    if (city) {
        dispatch(fetchCityAttractions(city)).then((data) => {
            if (data?.meta?.requestStatus == "fulfilled") {  
                console.log(data.payload);
                
                setAttractions(data.payload);
                setLoading(false);
            }
            
      })
    }
  }, [city, dispatch]);

  if (loading) return <p>Loading attractions...</p>;

  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold mb-6">Top Tourist Attractions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attractions.map((attraction, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            <img
              // The API response might have a nested 'photo' object
              src={attraction.photo?.images?.large?.url || FALLBACK_IMAGE}
              alt={attraction.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold mb-2">{attraction.name}</h3>
              <p className="text-gray-700 text-sm flex-grow">
                {attraction.description ||
                  "A popular local attraction. Click to learn more!"}
              </p>
              {/* This button links to the place's TripAdvisor page, which the API provides */}
              <Link
                to={`/city/${city}/${attraction.location_id}`}
                className="mt-4 inline-block text-sky-600 hover:text-sky-800 font-medium self-start"
              >
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TouristAttractions;
