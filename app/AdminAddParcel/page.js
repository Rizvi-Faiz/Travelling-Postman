"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import withAuth from "@/lib/withAuth";
import Logo from "/public/Logo.png";
import Image from "next/image";
import Papa from 'papaparse';

const AdminAddParcel = () => {
  const [username, setUsername] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [calculatedCost, setCalculatedCost] = useState(null);

  // New state for cities
  const [cities, setCities] = useState([]);
  const [senderCity, setSenderCity] = useState("");
  const [receiverCity, setReceiverCity] = useState("");

  // Load cities from CSV
  useEffect(() => {
    const loadCities = async () => {
      try {
        fetch("/data/Indian_cities.csv")
          .then((response) => response.text())
          .then((csvText) => {
            const { data } = Papa.parse(csvText, { header: true });
            setCities(data);
          });
      } catch (error) {
        console.error('Error reading cities file:', error);
      }
    };

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername("Admin");
    }

    loadCities();
  }, []);

  const handleOrderSearch = () => {
    const orderData = {
      orderId,
      currentLocation: "Mumbai",
      dispatchId: "D45",
      eta: "2 Days",
      contact: "+91 98765 43210",
    };
    setOrderDetails(orderData);
  };

  const calculateCost = () => {
    const cost = Math.floor(Math.random() * 1000) + 100; // Random cost between 100 and 1100
    setCalculatedCost(cost);
  };

  return (
    <div className="flex flex-col bg-gray-100">
      {/* Fixed Header and Navbar */}
      <header className="relative bg-white">
        <div className="flex items-center justify-center px-8 py-8 relative">
          <div className="absolute left-4">
            <Image src={Logo} alt="Postman Logo" width={120} height={120} />
          </div>
          <h1 className="text-4xl font-bold text-red-700 text-center">
            Welcome {username}!
          </h1>
        </div>
      </header>
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 grid grid-cols-2 gap-4">
        {/* Left Section */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="font-bold mb-4 text-lg">Add Parcel</h2>
          <div className="space-y-6">
            {/* Sender Details */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-4 mb-4">
                <h3 className="font-semibold text-lg">Sender Details</h3>
              </div>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Name"
              />
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Contact Number"
              />
              {/* <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Address"
              /> */}

              {/* City Dropdown for Sender within Address Field */}
              <select 
                className="w-full border rounded px-3 py-2 mb-2"
                value={senderCity}
                onChange={(e) => setSenderCity(e.target.value)}
              >
                <option value="">Select Sender City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city.City}>{city.City}</option>  
                ))}
              </select>

              <div className="flex space-x-4">
                <input
                  type="text"
                  className="w-1/2 border rounded px-3 py-2"
                  placeholder="Weight (kg)"
                />
                <input
                  type="text"
                  className="w-1/2 border rounded px-3 py-2"
                  placeholder="Dimensions (LxWxH cm)"
                />
              </div>
              <select className="w-full border rounded px-3 py-2 mt-2">
                <option>Preference</option>
                <option>Time</option>
                <option>Cost</option>
              </select>
            </div>

            {/* Receiver Details */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-4 mb-4">
                <h3 className="font-semibold text-lg">Receiver Details</h3>
              </div>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Name"
              />
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Contact Number"
              />
              {/* <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Address"
              /> */}

              {/* City Dropdown for Receiver within Address Field */}
              <select 
                className="w-full border rounded px-3 py-2 mb-2"
                value={receiverCity}
                onChange={(e) => setReceiverCity(e.target.value)}
              >
                <option value="">Select Receiver City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city.City}>{city.City}</option>  
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={calculateCost}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Calculate Cost
              </button>
              {calculatedCost !== null && (
                <span className="text-green-600 font-bold">
                  ₹{calculatedCost}
                </span>
              )}
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              Add Parcel
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="font-bold mb-4 text-lg">Manage Parcel</h2>
          <div className="mb-4">
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            <button
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors w-full"
              onClick={handleOrderSearch}
            >
              Search Order
            </button>
          </div>
          {orderDetails && (
            <div className="bg-gray-100 p-4 rounded">
              <p>
                <strong>Order ID:</strong> {orderDetails.orderId}
              </p>
              <p>
                <strong>Current Location:</strong> {orderDetails.currentLocation}
              </p>
              <p>
                <strong>Dispatch ID:</strong> {orderDetails.dispatchId}
              </p>
              <p>
                <strong>ETA:</strong> {orderDetails.eta}
              </p>
              <p>
                <strong>Contact:</strong> {orderDetails.contact}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default withAuth(AdminAddParcel);
