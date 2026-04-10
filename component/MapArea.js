"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import Routing from "./Routing";



const MapArea = ({ routeData, setRouteStats, transportMode, showDirections }) => {


  if (typeof window !== "undefined") {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }

  return (
    <div className="w-full h-[60vh] lg:h-auto">

      <MapContainer
        center={[32.1877, 74.1945]}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full"
      >

        <TileLayer
          url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_STADIA_API_KEY}`}
        />

        {/* Default marker for Gujranwala (optional) */}
        {!routeData && (
          <Marker position={[32.1877, 74.1945]}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {routeData && (
          <Routing
            key={showDirections ? "with-panel" : "no-panel"} // 🔥 FORCE RELOAD
            routeData={routeData}
            setRouteStats={setRouteStats}
            transportMode={transportMode}
            showDirections={showDirections}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapArea;