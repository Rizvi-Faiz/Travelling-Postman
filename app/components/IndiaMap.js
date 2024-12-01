"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});


const euclideanDistance = (lat1, lon1, lat2, lon2) => {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
};

const aStar = (graph, source, destination, cities) => {
  const openSet = new Set([source]);
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  gScore[source] = 0;
  fScore[source] = euclideanDistance(
    cities[source].Latitude,
    cities[source].Longitude,
    cities[destination].Latitude,
    cities[destination].Longitude
  );

  while (openSet.size > 0) {
    let current = [...openSet].reduce((a, b) =>
      fScore[a] < fScore[b] ? a : b
    );

    if (current === destination) {
      const path = [];
      while (current in cameFrom) {
        path.unshift(current);
        current = cameFrom[current];
      }
      path.unshift(source);
      return path;
    }

    openSet.delete(current);

    for (let neighbor of graph[current]) {
      const tentativeGScore =
        gScore[current] +
        euclideanDistance(
          cities[current].Latitude,
          cities[current].Longitude,
          cities[neighbor].Latitude,
          cities[neighbor].Longitude
        );

      if (tentativeGScore < (gScore[neighbor] || Infinity)) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] =
          tentativeGScore +
          euclideanDistance(
            cities[neighbor].Latitude,
            cities[neighbor].Longitude,
            cities[destination].Latitude,
            cities[destination].Longitude
          );

        openSet.add(neighbor);
      }
    }
  }

  return null; 
};

function IndiaMap() {
  const [cities, setCities] = useState([]);
  const [graph, setGraph] = useState({});
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [path, setPath] = useState([]);

  useEffect(() => {
    const csvFilePath = "/data/Indian_cities.csv";

    fetch(csvFilePath)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch CSV file");
        return response.text();
      })
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const citiesData = result.data.map((city, index) => ({
              ...city,
              id: index,
              Latitude: parseFloat(city.Latitude),
              Longitude: parseFloat(city.Longitude),
            }));

           
            const tempGraph = {};
            citiesData.forEach((city, index) => {
              tempGraph[index] = citiesData
                .filter((_, i) => i !== index) 
                .map((_, i) => i);
            });

            setCities(citiesData);
            setGraph(tempGraph);
          },
        });
      })
      .catch((error) => console.error("Error fetching CSV:", error));
  }, []);

  const findPath = () => {
    if (!source || !destination) {
      alert("Please select both source and destination cities!");
      return;
    }

    const sourceIndex = cities.findIndex((city) => city.City === source);
    const destinationIndex = cities.findIndex(
      (city) => city.City === destination
    );

    if (sourceIndex === -1 || destinationIndex === -1) {
      alert("Invalid source or destination!");
      return;
    }

    const resultPath = aStar(graph, sourceIndex, destinationIndex, cities);

    if (!resultPath) {
      alert("No valid path found!");
    } else {
      setPath(resultPath);
    }
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold mb-4">
        Indian Cities Pathfinding
      </h1>
      <div className="flex justify-center space-x-4 mb-5">
        <input
          type="text"
          placeholder="Source City"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Destination City"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={findPath}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Find Path
        </button>
      </div>
      <div className="flex justify-center">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: "600px", width: "80%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {cities.map((city, index) => (
            <Marker
              key={index}
              position={[city.Latitude, city.Longitude]}
            >
              <Popup>
                <strong>{city.City}</strong>
                <br />
                State: {city.State}
              </Popup>
            </Marker>
          ))}
          {path.length > 0 && (
            <Polyline
              positions={path.map((index) => [
                cities[index].Latitude,
                cities[index].Longitude,
              ])}
              color="red"
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default IndiaMap;
