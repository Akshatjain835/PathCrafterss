import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCityAttractions } from "@/features/auth/citySlice";
const FALLBACK_IMAGE =
  "https://placehold.co/1200x600/60a5fa/ffffff?text=Attraction";

const ExploreSection = ({city}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
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

  if (loading) return <p>Loading explore...</p>;

  

  if (loading) return <p className="p-4">Loading explore...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-left mb-5">Explore</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="my-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
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
              <h3 className="text-xl font-semibold mb-2 truncate max-w-full cursor-pointer"
                title={attraction.name}>
                  {attraction.name}
              </h3>
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
      </div>
    </div>
  );
};

export default ExploreSection;
