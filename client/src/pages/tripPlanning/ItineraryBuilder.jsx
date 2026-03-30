import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Sparkles, Plus, Trash2, Clock, Loader2, ChevronDown, ChevronUp, X } from "lucide-react";
import api from "@/features/auth/authAPI";

// ─── activity type styles ─────────────────────────────────────────────────────
const TYPE_STYLES = {
  sightseeing: { bg: "bg-blue-100",   text: "text-blue-700",   emoji: "🏛️" },
  food:        { bg: "bg-yellow-100", text: "text-yellow-700", emoji: "🍜" },
  adventure:   { bg: "bg-green-100",  text: "text-green-700",  emoji: "🧗" },
  shopping:    { bg: "bg-pink-100",   text: "text-pink-700",   emoji: "🛍️" },
  relaxation:  { bg: "bg-purple-100", text: "text-purple-700", emoji: "🧘" },
  culture:     { bg: "bg-orange-100", text: "text-orange-700", emoji: "🎭" },
  dining:      { bg: "bg-red-100",    text: "text-red-700",    emoji: "🍽️" },
  transport:   { bg: "bg-gray-100",   text: "text-gray-600",   emoji: "🚌" },
};
const typeStyle = (type) => TYPE_STYLES[type] || TYPE_STYLES.sightseeing;

const ItineraryBuilder = ({ days, setDays, trip }) => {
  const [newActivity, setNewActivity] = useState({ dayIndex: null, name: "", time: "", type: "sightseeing" });
  const [collapsed, setCollapsed]     = useState({});

  const [showAIForm, setShowAIForm]   = useState(false);
  const [aiNumDays, setAiNumDays]     = useState("");
  const [aiBudget, setAiBudget]       = useState(trip?.budget?.total || "");
  const [aiLoading, setAiLoading]     = useState(false);

  const addDay = () => {
    setDays([...days, { dayNumber: days.length + 1, activities: [] }]);
    toast.success("Day added to itinerary");
  };

  const deleteDay = (dayNumber) => {
    if (!confirm("Delete this day and all its activities?")) return;
    setDays(
      days
        .filter((d) => d.dayNumber !== dayNumber)
        .map((d, i) => ({ ...d, dayNumber: i + 1 }))
    );
    toast.success("Day removed");
  };

  const toggleCollapse = (dn) => setCollapsed((c) => ({ ...c, [dn]: !c[dn] }));

  const saveActivity = () => {
    if (!newActivity.name || !newActivity.time) {
      toast.error("Activity name and time are required.");
      return;
    }
    setDays(
      days.map((day, i) =>
        i === newActivity.dayIndex
          ? { ...day, activities: [...day.activities, { name: newActivity.name, time: newActivity.time, type: newActivity.type }] }
          : day
      )
    );
    setNewActivity({ dayIndex: null, name: "", time: "", type: "sightseeing" });
    toast.success("Activity added");
  };

  const deleteActivity = (dayIndex, actIndex) =>
    setDays(
      days.map((day, i) =>
        i === dayIndex
          ? { ...day, activities: day.activities.filter((_, idx) => idx !== actIndex) }
          : day
      )
    );

  const handleGenerate = async () => {
    if (!aiNumDays || Number(aiNumDays) < 1) { toast.error("Please enter a valid number of days."); return; }

    setAiLoading(true);
    try {
      const res = await api.post("/api/ai/generate-itinerary", {
        destination: trip?.destination || {},
        numDays:     Number(aiNumDays),
        budget:      aiBudget,
        travelStyle: "Balanced",
        interests:   [],
      });
      const aiDays = res.data.days || [];
      setDays(aiDays);
      setShowAIForm(false);
      setAiNumDays("");
      toast.success(`${aiDays.length}-day itinerary generated! You can edit it below.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate itinerary.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-4 border-t">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Itinerary</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAIForm((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-violet-600 text-white rounded-3xl hover:bg-violet-800 text-sm"
          >
            <Sparkles size={14} />
            Generate with AI
          </Button>

          <Button
            onClick={() => { addDay(); }}
            className="px-3 py-1 bg-sky-600 text-white rounded-3xl hover:bg-sky-800"
          >
            + Add Day
          </Button>
        </div>
      </div>

      {showAIForm && (
        <div className="mb-5 border border-violet-200 rounded-2xl bg-violet-50 p-5 relative">
          <button
            onClick={() => setShowAIForm(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-violet-500" />
            <span className="font-semibold text-gray-800">Generate Itinerary with AI</span>
            
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days</label>
              <input
                type="number"
                min="1"
                max="30"
                placeholder="e.g. 5"
                value={aiNumDays}
                onChange={(e) => setAiNumDays(e.target.value)}
                className="border rounded-lg px-3 py-2 w-32 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={aiBudget}
                onChange={(e) => setAiBudget(e.target.value)}
                className="border rounded-lg px-3 py-2 w-40 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={aiLoading}
              className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2 rounded-full hover:bg-violet-800 disabled:opacity-60 text-sm"
            >
              {aiLoading
                ? <><Loader2 size={14} className="animate-spin" /> Generating…</>
                : <><Sparkles size={14} /> Generate</>}
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Gemini will plan {aiNumDays || "N"} days for {trip?.destination?.city || "your destination"}.
            {aiBudget ? ` Budget: ₹${aiBudget}.` : ""} You can edit any activity after.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {days.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8 border-2 border-dashed rounded-xl">
            No days yet — add a day manually or generate with AI.
          </p>
        )}

        {days.map((day, dayIndex) => {
          const isCollapsed = collapsed[day.dayNumber];
          return (
            <div key={day.dayNumber} className="border rounded-lg bg-white shadow-sm overflow-hidden">

              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b">
                <button
                  onClick={() => toggleCollapse(day.dayNumber)}
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-sky-600"
                >
                  {isCollapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                  Day {day.dayNumber}
                  <span className="text-xs text-gray-400 font-normal">
                    ({day.activities.length} {day.activities.length === 1 ? "activity" : "activities"})
                  </span>
                </button>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setNewActivity({ dayIndex, name: "", time: "", type: "sightseeing" })}
                    className="text-sky-600 text-sm bg-white rounded hover:bg-gray-100"
                  >
                    + Add Activity
                  </Button>
                  <Button
                    onClick={() => deleteDay(day.dayNumber)}
                    className="text-red-500 text-sm bg-white rounded hover:bg-gray-100"
                  >
                    🗑 Delete Day
                  </Button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="p-4 space-y-3">
                  {newActivity.dayIndex === dayIndex && (
                    <div className="flex flex-wrap gap-2 p-3 bg-sky-50 rounded-lg border border-sky-200">
                      <input
                        type="text"
                        placeholder="Activity name"
                        value={newActivity.name}
                        onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                        className="border rounded px-2 py-1 text-sm flex-1 min-w-36 focus:outline-none focus:ring-2 focus:ring-sky-300"
                      />
                      <input
                        type="time"
                        value={newActivity.time}
                        onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                      />
                      <select
                        value={newActivity.type}
                        onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                      >
                        {Object.keys(TYPE_STYLES).map((t) => (
                          <option key={t} value={t}>{TYPE_STYLES[t].emoji} {t}</option>
                        ))}
                      </select>
                      <Button onClick={saveActivity} className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-800 text-sm">Add</Button>
                      <Button
                        onClick={() => setNewActivity({ dayIndex: null, name: "", time: "", type: "sightseeing" })}
                        className="px-3 py-1 bg-white border rounded text-sm text-gray-500 hover:bg-gray-100"
                      >Cancel</Button>
                    </div>
                  )}

                  {/* Activity list */}
                  {day.activities.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-3">No activities added yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {[...day.activities]
                        .sort((a, b) => (a.time > b.time ? 1 : -1))
                        .map((activity, idx) => {
                          const s = typeStyle(activity.type);
                          return (
                            <li
                              key={idx}
                              className="flex justify-between items-center p-2 bg-gray-50 rounded border"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
                                  {s.emoji} {activity.type}
                                </span>
                                <div>
                                  <p className="font-medium text-sm">{activity.name}</p>
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock size={10} /> {activity.time}
                                  </p>
                                </div>
                              </div>
                              <Button
                                onClick={() => deleteActivity(dayIndex, idx)}
                                className="text-red-500 text-sm bg-gray-200 rounded-full h-6 w-6 flex items-center justify-center hover:bg-gray-400"
                              >
                                ❌
                              </Button>
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryBuilder;