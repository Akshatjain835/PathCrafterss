import { Button } from "@/components/ui/Button";
import { CalendarDays, UserPlus, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

const TripHeader = ({ trip, onSave, onDatesChange }) => {
  const [startDate, setStartDate] = useState(trip.startDate || "");
  const [endDate, setEndDate] = useState(trip.endDate || "");

  return (
    <div className="flex justify-between items-center p-4 border-b">

      <div>
        <h1 className="text-2xl font-semibold">
          Trip to {trip.destination.city}
        </h1>
        {trip.destination.country && (
          <p className="text-sm text-gray-500">
            {trip.destination.city}, {trip.destination.country}
          </p>
        )}
      </div>

      <div className="flex gap-2">

        {/* Dates */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-3xl flex gap-1">
              <CalendarDays size={16} />
              Dates
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Trip Dates</DialogTitle>
            </DialogHeader>

            <input
              type="date"
              value={startDate?.slice(0, 10)}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="date"
              value={endDate?.slice(0, 10)}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />

            <Button
              className="mt-3"
              onClick={() =>{
                onDatesChange({
                  startDate,
                  endDate,
                });
                toast.success("Trip dates updated")
              }}
            >
              Save Dates
            </Button>
          </DialogContent>
        </Dialog>

        {/* Save */}
        <Button
          onClick={onSave}
          className="bg-sky-600 text-white rounded-3xl"
        >
          <Save size={16} />
          Save
        </Button>
      </div>
    </div>
  );
};


export default TripHeader;
