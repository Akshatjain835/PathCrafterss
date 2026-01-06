import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExploreSection from "./tripPlanning/ExploreSection";
import ItineraryBuilder from "./tripPlanning/ItineraryBuilder";
import MapView from "./tripPlanning/MapView";
import Sidebar from "./tripPlanning/Sidebar";
import TripHeader from "./tripPlanning/TripHeader";
import BudgetSection from "./tripPlanning/BudgetSection";
import NotesSection from "./tripPlanning/NotesSection";
import api from "@/features/auth/authAPI";
import { toast } from "sonner";

const TripPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      const res = await api.get(`/api/trips/${tripId}`);

      setTrip({
        ...res.data,
        days: res.data.days || [],
        notes: res.data.notes || "",
        budget: res.data.budget || {
          total: 0,
          expenses: [],
        },
      });
    };

    fetchTrip();
  }, [tripId]);

  const handleSaveTrip = async () => {
    if (trip.days.length === 0) {
      toast.error("Add at least one day to itinerary");
      return;
    }

    try {
      await api.put(`/api/trips/${tripId}/save`, {
        days: trip.days,
        notes: trip.notes,
        budget: trip.budget,
        startDate: trip.startDate,
        endDate: trip.endDate,
      });

      toast.success("Trip saved successfully ");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save trip ");
    }
  };

  if (!trip) return <p className="p-4">Loading trip...</p>;

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 overflow-y-auto scroll-smooth">
        <section id="overview">
          <TripHeader
            trip={trip}
            onSave={handleSaveTrip}
            onDatesChange={(dates) =>
              setTrip((prev) => ({ ...prev, ...dates }))
            }
          />
        </section>

        <section id="explore">
          <ExploreSection city={trip.destination.city} />
        </section>

        <section id="itinerary">
          <ItineraryBuilder
            days={trip.days}
            setDays={(days) => setTrip((prev) => ({ ...prev, days }))}
          />
        </section>

        <section id="budget">
          <BudgetSection
            budget={trip.budget}
            setBudget={(budget) => setTrip((prev) => ({ ...prev, budget }))}
          />
        </section>

        <section id="notes">
          <NotesSection
            notes={trip.notes}
            setNotes={(notes) => setTrip((prev) => ({ ...prev, notes }))}
          />
        </section>
      </div>

      <MapView city={trip.destination.city} />
    </div>
  );
};

export default TripPage;
