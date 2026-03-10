import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/features/auth/authAPI";
import { MapPin, Trash2 } from "lucide-react";

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  const deleteTrip = async (id) => {
  try {
    await api.delete(`/api/trips/${id}`);

    setTrips((prev) => prev.filter((trip) => trip._id !== id));
  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/api/trips");
        setTrips(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">My Trips</h1>

      {trips.length === 0 ? (
        <p className="text-gray-500">No trips saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
  <div
    key={trip._id}
    onClick={() => navigate(`/trip/${trip._id}`)}
    className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden relative"
  >
    {/* Delete Icon */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        deleteTrip(trip._id);
      }}
      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-100"
    >
      <Trash2 size={18} className="text-red-500" />
    </button>

    <div className="h-40 bg-sky-100 flex items-center justify-center">
      <MapPin size={40} className="text-sky-600" />
    </div>

    <div className="p-4">
      <h2 className="text-xl font-semibold">
        {trip.title || `Trip to ${trip.destination.city}`}
      </h2>

      <p className="text-gray-500 text-sm">
        {trip.destination.city}, {trip.destination.country}
      </p>

      <p className="text-xs text-gray-400 mt-2">
        {trip.days?.length || 0} days planned
      </p>
    </div>
  </div>
))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
