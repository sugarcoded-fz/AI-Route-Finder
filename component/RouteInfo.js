"use client";

import React, {useEffect, useState} from "react";

const RouteInfo = ({ routeStats, transportMode }) => {

  const [aiInsight, setAiInsight] = useState("");



useEffect(() => {
  if (!routeStats) return;

  const fetchInsight = async () => {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        distance: routeStats.distance,
        time: routeStats.time,
        transportMode,
      }),
    });

    const data = await res.json();
    setAiInsight(data.insight);
  };

  fetchInsight();
}, [routeStats, transportMode]);




  if (!routeStats) {
    return <div className="p-4">No route selected</div>;
  }

  return (
    <div className="w-full bg-gray-900 p-4 shadow-inner">

      <h2 className="text-lg font-semibold text-white mb-2">
        Route Information
      </h2>

      <div className="flex gap-3 flex-col lg:flex-row text-gray-300">

        <div className="text-sm lg:w-1/4">
          <p>🚗 Time:  {routeStats.time} mins</p>
          <p>📏 Distance: {routeStats.distance}  km</p>
          <p>💰 Cost: Rs. {routeStats.cost}</p>
        </div>

        <div>
          <p className="font-medium">🤖 AI Insight:</p>
          <p className="text-sm">
           {aiInsight || "Generating insight..."}
          </p>
        </div>

      </div>

    </div>
  );
};

export default RouteInfo;




