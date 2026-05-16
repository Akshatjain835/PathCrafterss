import { useState } from "react";

const items = [
  { id: "overview",  label: "Overview",  emoji: "🗺️" },
  { id: "explore",   label: "Explore",   emoji: "🔍" },
  { id: "itinerary", label: "Itinerary", emoji: "📅" },
  { id: "budget",    label: "Budget",    emoji: "💰" },
  { id: "notes",     label: "Notes",     emoji: "📝" },
  { id: "packing",   label: "Packing",   emoji: "🎒" },
];

const Sidebar = () => {
  const [active, setActive] = useState("overview");

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  return (
    <div className="w-44 border-r p-4 bg-white">
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`cursor-pointer px-3 py-2 rounded-md text-sm font-medium
              ${
                active === item.id
                  ? "bg-sky-100 text-sky-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {item.emoji} {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;