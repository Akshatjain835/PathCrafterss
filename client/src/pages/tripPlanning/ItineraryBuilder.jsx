import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { toast } from "sonner";

const ItineraryBuilder = ({days, setDays}) => {
  
  const [newActivity, setNewActivity] = useState({
    dayIndex: null,
    name: "",
    time: "",
  });

  const addDay = () => {
    setDays([...days, { dayNumber: days.length + 1, activities: [] }]);
  };

  const deleteDay = (dayNumber) => {
    if (!confirm("Delete this day?")) return;

    const updatedDays = days
      .filter((day) => day.dayNumber !== dayNumber)
      .map((day, index) => ({ ...day, dayNumber: index + 1 }));

    setDays(updatedDays);
  };

  const openAddActivity = (dayIndex) => {
    setNewActivity({ dayIndex, name: "", time: "" });
  };

  const saveActivity = () => {
  if (!newActivity.name || !newActivity.time) return;

  const updatedDays = days.map((day, index) =>
    index === newActivity.dayIndex
      ? {
          ...day,
          activities: [
            ...day.activities,
            {
              name: newActivity.name,
              time: newActivity.time,
            },
          ],
        }
      : day
  );

  setDays(updatedDays);
  setNewActivity({ dayIndex: null, name: "", time: "" });
};

  const deleteActivity = (dayIndex, activityIndex) => {
  const updatedDays = days.map((day, i) =>
    i === dayIndex
      ? {
          ...day,
          activities: day.activities.filter(
            (_, idx) => idx !== activityIndex
          ),
        }
      : day
  );

  setDays(updatedDays);
};


  return (
    <div className="p-4 border-t">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Itinerary</h2>

        <Button
          onClick={() => { addDay(); 
            toast.success("Day added to itinerary"); }}
          className="px-3 py-1 bg-sky-600 text-white rounded-3xl  hover:bg-sky-800"
        >
          + Add Day
        </Button>
      </div>

      <div className="space-y-4">
        {days.map((day, dayIndex) => (
          <div
            key={day.dayNumber}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            {/* Day Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">
                Day {day.dayNumber}
              </h3>

              <div className="flex gap-3">
                <Button
                  onClick={() => openAddActivity(dayIndex)}
                  className="text-sky-600 text-sm bg-white rounded hover:bg-gray-100"
                >
                  + Add Activity
                </Button>

                <Button
                  onClick={() => deleteDay(day.dayNumber)}
                  className="text-red-500 text-sm bg-white  rounded hover:bg-gray-100"
                >
                  🗑 Delete Day
                </Button>
              </div>
            </div>

            {/* Add Activity Form */}
            {newActivity.dayIndex === dayIndex && (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Activity name"
                  value={newActivity.name}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, name: e.target.value })
                  }
                  className="border px-2 py-1 rounded w-1/2"
                />

                <input
                  type="time"
                  value={newActivity.time}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, time: e.target.value })
                  }
                  className="border px-2 py-1 rounded"
                />

                <Button
                  onClick={saveActivity}
                  className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-800"
                >
                  Add
                </Button>
              </div>
            )}

            {/* Activities */}
            {day.activities.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No activities added yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {day.activities.map((activity, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-xs text-gray-500">
                        ⏰ {activity.time}
                      </p>
                    </div>

                    <Button
                      onClick={() =>
                        deleteActivity(dayIndex, idx)
                      }
                      className="text-red-500 text-sm bg-gray-200 rounded-full h-6 w-6 flex items-center justify-center hover:bg-gray-400"
                    >
                      ❌
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryBuilder;
