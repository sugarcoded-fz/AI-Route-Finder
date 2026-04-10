"use client";

import React, { useState } from "react";
import { Car, Bike, Footprints } from "lucide-react";
import { getCoordinates } from "@/utils/geocode";

const Sidebar = ({ setRouteData, setTransportMode, setShowDirections }) => {
  const [selectedTransport, setSelectedTransport] = useState("car");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleFindRoute = async () => {
    const start = await getCoordinates(from);
    const end = await getCoordinates(to);

    if (!start || !end) {
      alert("Location not found");
      return;
    }

    // send to parent
    setRouteData({ start, end });
    setShowDirections(false);
  }

  const transportOptions = [
    { id: "walk", label: "Walk", icon: <Footprints size={20} /> },
    { id: "bike", label: "Bike", icon: <Bike size={20} /> },
    { id: "car", label: "Car", icon: <Car size={20} /> },
  ];

  return (
    <div className="w-full bg-gray-900 p-5 shadow-md flex flex-col gap-5 lg:w-1/3 lg:h-full overflow-y-auto">

      <h2 className="text-lg font-semibold text-white">
        Find Route
      </h2>

      {/* From */}
      <div>
        <label className="text-sm text-gray-300 ">
          Your location
        </label>
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Enter starting point"
          className="w-full mt-1 p-2 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-[#70000E]"
        />
      </div>

      {/* To */}
      <div>
        <label className="text-sm text-gray-300 ">
          Your destination
        </label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Enter destination"
          className="w-full mt-1 p-2 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-[#70000E]"
        />
      </div>

      {/* Transport Selector */}
      <div>
        <label className="text-sm text-gray-300 ">
          Means of transportation
        </label>

        <div className="mt-2 bg-gray-800 0 p-2 rounded-2xl flex justify-between">
          {transportOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setSelectedTransport(option.id);
                setTransportMode(option.id);
              }}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl transition w-full
                ${selectedTransport === option.id
                  ? "bg-[#70000E] text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700"
                }
              `}
            >
              {option.icon}
              <span className="text-xs">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Button */}
      <button
        className="mt-4 bg-[#70000E] text-white py-2 rounded-xl hover:opacity-90 transition"
        onClick={handleFindRoute}
      >
        Find Route
      </button>

    </div>
  );
};

export default Sidebar;