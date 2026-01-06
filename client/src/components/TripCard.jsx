import { CalendarDays, MapPin, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const TripCard = ({ trip }) => {
  const totalDays = trip.days?.length || 0;
  const budget = trip.budget?.total || 0;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col">
      <h2 className="text-xl font-semibold mb-1">
        Trip to {trip.destination.city}
      </h2>

      <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
        <MapPin size={14} />
        {trip.destination.city}, {trip.destination.country}
      </p>

      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <span className="flex items-center gap-1">
          <CalendarDays size={14} />
          {totalDays} days
        </span>

        <span className="flex items-center gap-1">
          <Wallet size={14} />
          ₹{budget}
        </span>
      </div>

      <Link
        to={`/trips/${trip._id}`}
        className="mt-auto text-center bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700"
      >
        Open Trip
      </Link>
    </div>
  );
};

export default TripCard;
