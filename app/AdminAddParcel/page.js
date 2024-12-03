"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import withAuth from "@/lib/withAuth";
import Logo from "/public/Logo.png";
import Image from "next/image";

const AdminAddParcel = () => {
  const [username, setUsername] = useState("");
  const [orderId, setOrderId] = useState(""); // State for order ID input
  const [orderDetails, setOrderDetails] = useState(null); // State for order details

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // Default to "Admin" if username is not available
      setUsername("Admin");
    }
  }, []);

  const handleOrderSearch = () => {
    // Simulated order data for demo purposes
    const orderData = {
      orderId,
      currentLocation: "Mumbai",
      dispatchId: "D45",
      eta: "2 Days",
      contact: "+91 98765 43210",
    };

    setOrderDetails(orderData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Fixed Header and Navbar */}
      <header className="relative bg-white shadow-md">
        <div className="flex items-center justify-center px-8 py-4 relative">
          {/* Logo */}
          <div className="absolute left-4">
            <Image src={Logo} alt="Postman Logo" width={120} height={120} />
          </div>
          <h1 className="text-4xl font-bold text-red-700 text-center">
            Welcome {username} !
          </h1>
        </div>
        <div className="bg-red-700 h-4 w-full"></div>
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
                {/* <Image
                  src="https://cdn-icons-png.flaticon.com/512/4066/4066067.png"
                  alt="Sender"
                  width={50}
                  height={50}
                /> */}
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
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Address"
              />
              <select className="w-full border rounded px-3 py-2">
                <option>Preference</option>
                <option>Time</option>
                <option>Cost</option>
              </select>
            </div>

            {/* Receiver Details */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-4 mb-4">
                {/* <Image
                  src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
                  alt="Receiver"
                  width={50}
                  height={50}
                /> */}
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
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Address"
              />
            </div>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 mt-6 rounded hover:bg-green-700 transition-colors w-full">
            Add Parcel
          </button>
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
