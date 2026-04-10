"use client";

import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";
import RouteInfo from "@/component/RouteInfo";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import to prevent SSR issues
const MapArea = dynamic(() => import("@/component/MapArea"), { ssr: false });

export default function Home() {
  const [routeData, setRouteData] = useState(null);
  const [routeStats, setRouteStats] = useState(null);
  const [transportMode, setTransportMode] = useState("car");
  const [showDirections, setShowDirections] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">

      <Navbar showDirections={showDirections} setShowDirections={setShowDirections} routeData={routeData} />
      
      <div className="flex flex-col-reverse lg:flex-row flex-1">
        <Sidebar setRouteData={setRouteData} setTransportMode={setTransportMode} setShowDirections={setShowDirections} />
        <MapArea
          routeData={routeData} setRouteStats={setRouteStats}
          transportMode={transportMode} showDirections={showDirections}
        />
      </div>

      <RouteInfo routeStats={routeStats} transportMode={transportMode} />
      
    </div>
  );
}
