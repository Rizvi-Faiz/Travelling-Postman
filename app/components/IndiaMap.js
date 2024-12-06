import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import Papa from "papaparse"; // To parse CSV files

mapboxgl.accessToken = 'pk.eyJ1Ijoic2F1cmFiaC12ZXJtYSIsImEiOiJjbTQ4OXpnZGwwYTQ2MmtxeDFtajNhZ2l5In0.tn-LonzCO78ByE5-rSc5mg';

const IndiaMap = () => {
    const [cities, setCities] = useState([]);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        // Load cities from CSV file
        fetch("/data/Indian_cities.csv")
            .then((response) => response.text())
            .then((csvText) => {
                const { data } = Papa.parse(csvText, { header: true });
                setCities(data);
            });

        // Initialize Mapbox map
        const mapInstance = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [77.5946, 12.9716], // Default center (Bangalore)
            zoom: 12,
        });
        setMap(mapInstance);

        return () => mapInstance.remove();
    }, []);

    const fetchRoute = async (startCoords, endCoords) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords.join(",")};${endCoords.join(",")}?geometries=geojson&access_token=${mapboxgl.accessToken}`
            );
            const data = await response.json();
            const route = data.routes[0].geometry;

            // Add route to the map
            if (map.getSource("route")) {
                map.getSource("route").setData({
                    type: "Feature",
                    geometry: route,
                });
            } else {
                map.addSource("route", {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        geometry: route,
                    },
                });

                map.addLayer({
                    id: "route",
                    type: "line",
                    source: "route",
                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                    },
                    paint: {
                        "line-color": "#0074D9",
                        "line-width": 5,
                    },
                });
            }

            // // Add markers for start and end points
            // new mapboxgl.Marker().setLngLat(startCoords).addTo(map);
            // new mapboxgl.Marker({ color: "red" }).setLngLat(endCoords).addTo(map);

            const markers = document.getElementsByClassName('mapboxgl-marker');
            while (markers[0]) {
                markers[0].remove();
            }

            // Add markers for start and end points
            new mapboxgl.Marker().setLngLat(startCoords).addTo(map);
            new mapboxgl.Marker({ color: "red" }).setLngLat(endCoords).addTo(map);

            // Adjust map viewport to fit the route
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend(startCoords);
            bounds.extend(endCoords);
            map.fitBounds(bounds, { padding: 50 }); // Add padding around the bounds
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

    const handleStartChange = (e) => {
        const selectedCity = cities.find((city) => city.City === e.target.value);
        setStart([parseFloat(selectedCity.Longitude), parseFloat(selectedCity.Latitude)]);
    };

    const handleEndChange = (e) => {
        const selectedCity = cities.find((city) => city.City === e.target.value);
        setEnd([parseFloat(selectedCity.Longitude), parseFloat(selectedCity.Latitude)]);
    };

    const handleGetRoute = () => {
        if (start && end) {
            fetchRoute(start, end);
        } else {
            alert("Please select both start and end cities.");
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Controls Section */}
            <div className="flex items-center justify-center gap-4 p-4 bg-gray-100 shadow-md z-10">
                <select
                    onChange={handleStartChange}
                    defaultValue=""
                    className="w-1/2 p-2 border rounded-md text-gray-700"
                >
                    <option value="" disabled>
                        Select Starting City
                    </option>
                    {cities.map((city, index) => (
                        <option key={index} value={city.City}>
                            {city.City}
                        </option>
                    ))}
                </select>
                <select
                    onChange={handleEndChange}
                    defaultValue=""
                    className="w-1/2 p-2 border rounded-md text-gray-700"
                >
                    <option value="" disabled>
                        Select Destination City
                    </option>
                    {cities.map((city, index) => (
                        <option key={index} value={city.City}>
                            {city.City}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleGetRoute}
                    className="w-1/4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                >
                    Get Route
                </button>
            </div>

            {/* Map Section */}
            <div id="map" className="flex-1"></div>
        </div>
    );
};

export default IndiaMap;
