"use client";

import React from "react";

const Navbar = ({ showDirections ,setShowDirections, routeData}) => {

  const startTravel = () => {
    if (!routeData) {
      alert("Please select a route first");
      return;
    }
    setTimeout(() => setShowDirections(prev => !prev), 200);
  };

  return (
    <nav className="w-full bg-gray-900 shadow-md px-6 py-4 flex items-center justify-between">

      {/* Left - Logo / Title */}
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-white">
          RouteIQ
        </h1>
        <div className="text-xs">AI Route Finder</div>
      </div>


      {/* Right - Action Button */}
      <div>
        <button
          onClick={startTravel}
          className="bg-[#70000E] text-sm sm:text-base text-white px-4 py-2 rounded-xl hover:bg-[#51030c] transition shadow-sm"
        >
          {showDirections ? "Stop Travel 🚀": "Start Travel 🚀"}
        </button>
      </div>

    </nav>
  );
};

export default Navbar;