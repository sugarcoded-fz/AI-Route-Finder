import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const Routing = ({ routeData, setRouteStats, transportMode, showDirections }) => {
    const map = useMap();
    const routingControlRef = useRef(null);
    const startMarkerRef = useRef(null);
    const endMarkerRef = useRef(null);

    useEffect(() => {
        if (!routeData || !map) return;

        const { start, end } = routeData;

        if (routingControlRef.current) {
            try {
                // 🔥 remove route lines manually
                routingControlRef.current.getPlan().setWaypoints([]);

                // small delay helps avoid internal crash
                setTimeout(() => {
                    try {
                        map.removeControl(routingControlRef.current);
                    } catch (e) { }
                    routingControlRef.current = null;
                }, 0);

            } catch (e) { }
        }

        if (startMarkerRef.current) {
            map.removeLayer(startMarkerRef.current);
        }
        if (endMarkerRef.current) {
            map.removeLayer(endMarkerRef.current);
        }

        // Start icon (blue dot)
        const startIcon = L.divIcon({
            className: "custom-start-icon",
            html: `<div style="
            width:12px;
            height:12px;
            background:#2563eb;
            border:2px solid white;
            border-radius:50%;
            box-shadow:0 0 6px rgba(0,0,0,0.3);
            "></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
        });

        // End icon (default marker)
        const endIcon = new L.Icon({
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            iconRetinaUrl:
                "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
            shadowUrl:
                "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });

        routingControlRef.current = L.Routing.control({
            waypoints: [
                L.latLng(start.lat, start.lon),
                L.latLng(end.lat, end.lon),
            ],
            router: L.Routing.osrmv1({
                profile: transportMode, // 🔥 dynamic mode
            }),
            lineOptions: {
                styles: [
                    {
                        color: "#70000E",
                        weight: 6,
                        opacity: 0.9,
                    },
                ],
            },
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            createMarker: () => null, // disable default markers
            show: showDirections, // 🔥 always disable default panel
        }).addTo(map);

        routingControlRef.current.getContainer().style.display = "none";
        if (showDirections) {
            routingControlRef.current.getContainer().style.display = "block";
        }


        // Custom markers
        startMarkerRef.current = L.marker([start.lat, start.lon], {
            icon: startIcon,
        }).addTo(map);

        endMarkerRef.current = L.marker([end.lat, end.lon], {
            icon: endIcon,
        }).addTo(map);

        // Route stats
        routingControlRef.current.on("routesfound", function (e) {
            const route = e.routes[0];


            let distance = route.summary.totalDistance; // meters
            // console.log(distance)
            let time = route.summary.totalTime; // seconds
            // console.log(time)
            let cost = (distance / (1000 * 12)) * 420;


            // 🔥 Adjust based on transport
            if (transportMode === "walk") {
                time = distance / 1.4; // avg walking speed (m/s)
                cost = 0;
            }
            else if (transportMode === "bike") {
                time = distance / 4.5; // avg cycling speed
                cost = (distance / (1000 * 40)) * 420;
            }

            setRouteStats({
                distance: (distance / 1000).toFixed(2),
                time: (time / 60).toFixed(0),
                cost: cost.toFixed(0)
            });

        });

        return () => {
            if (routingControlRef.current && map) {
                try {
                    map.removeControl(routingControlRef.current);
                } catch (e) {
                    console.log("Already removed");
                }
                routingControlRef.current = null;
            }
            if (startMarkerRef.current) {
                map.removeLayer(startMarkerRef.current);
            }
            if (endMarkerRef.current) {
                map.removeLayer(endMarkerRef.current);
            }

        };
    }, [routeData, map, transportMode]);

    return null;
};

export default Routing;