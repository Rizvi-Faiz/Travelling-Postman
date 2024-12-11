"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import withAuth from "@/lib/withAuth";
import Logo from "/public/Logo.png";
import Image from "next/image";
import Papa from "papaparse";
import { useRouter } from "next/navigation"; // Correct import for routing
import { SendOrderConfirmationEmail } from "@/helpers/SendOrderConfirmationEmail";

const AdminAddParcel = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [cities, setCities] = useState([]);
  const [senderCity, setSenderCity] = useState("");
  const [receiverCity, setReceiverCity] = useState("");

  const [parcelData, setParcelData] = useState({
    sender_user_id: "",
    senderCity: "",
    weight: "",
    volume: "",
    preference: "",
    receiver_user_id: "",
    receiverCity: "",
    cost: 10, // Default cost
  });

  const router = useRouter(); // Initialize router for navigation

  useEffect(() => {
    const role = localStorage.getItem("role");

    // Redirect if not Admin
    if (role !== "Admin") {
      router.push("/login");
    } else {
      const storedUsername = localStorage.getItem("username");
      const storedUserId = localStorage.getItem("userId");

      if (storedUsername && storedUserId) {
        setUsername(storedUsername);
        setUserId(storedUserId);
      } else {
        console.error("User data not found in localStorage");
      }
    }

    const loadCities = async () => {
      try {
        fetch("/data/Indian_cities.csv")
          .then((response) => response.text())
          .then((csvText) => {
            const { data } = Papa.parse(csvText, { header: true });
            setCities(data);
          });
      } catch (error) {
        console.error("Error reading cities file:", error);
      }
    };

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

  const calculateCost = async () => {
    const { weight, volume, senderCity, receiverCity } = parcelData;

    if (!weight || !volume || !senderCity || !receiverCity) {
      alert("Please fill in all required fields for cost calculation.");
      return;
    }
    setButtonClicked(true);

    try {
      // Fetch lat-lon for sender and receiver cities
      const senderCoords = cities.find(city => city.City === senderCity);
      const receiverCoords = cities.find(city => city.City === receiverCity);

      if (!senderCoords || !receiverCoords) {
        alert("City coordinates not found. Please select valid cities.");
        return;
      }

      const body = {
        weight: parseFloat(weight),
        volume: parseFloat(volume),
        lat1: parseFloat(senderCoords.Latitude),
        lon1: parseFloat(senderCoords.Longitude),
        lat2: parseFloat(receiverCoords.Latitude),
        lon2: parseFloat(receiverCoords.Longitude),
        serviceType: parcelData.preference, // Example: Adjust based on user input
      };

      const response = await fetch("/api/calculate-cost", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setParcelData(prevState => ({ ...prevState, cost: data.cost }));
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to calculate cost.");
      }
    } catch (error) {
      console.error("Error calculating cost:", error);
      alert("Error calculating cost. Please try again.");
    }
  };

  const handleAddParcel = async () => {
    const { sender_user_id, senderCity, weight, volume, preference, receiver_user_id, receiverCity, cost } = parcelData;

    console.log("Current Parcel Data:", {
      sender_user_id,
      senderCity,
      weight,
      volume,
      preference,
      receiver_user_id,
      receiverCity,
      cost,
    });

    if (!sender_user_id || !senderCity || !weight || !volume || !preference || !receiver_user_id || !receiverCity || !cost) {
      console.log("Missing fields detected");
      alert("Please fill all the fields!");
      return;
    }

    try {
      console.log("Fetching email for sender_user_id:", sender_user_id);

      // Fetch email from the users table
      const emailResponse = await fetch("/api/get-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_user_id }),
      });

      const emailData = await emailResponse.json();
      if (!emailResponse.ok) {
        alert(`Failed to fetch email: ${emailData.error}`);
        return;
      }

      const senderEmail = emailData.email;
      console.log("Sender Email fetched:", senderEmail);

      // Send the parcel data to the order API
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_user_id,
          senderCity,
          weight,
          volume,
          preference,
          receiver_user_id,
          receiverCity,
          cost,
          userId,
        }),
      });

      const data = await response.json();

      console.log("Server response:", data);

      if (response.ok) {
        alert("Parcel added successfully!");
        console.log("New Order ID:", data.orderId);

        // Fetch and add route
        try {
          const routeResponse = await fetch("/api/routes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: data.orderId, // Send the generated order ID
              senderCity: parcelData.senderCity,
              receiverCity: parcelData.receiverCity,
              weight: parcelData.weight, // Pass the order weight here
              preference: parcelData.preference,
            }),
          });

          const routeData = await routeResponse.json();
          console.log("Route API Response:", routeData);

          if (routeResponse.ok) {
            alert(`Route added successfully: ${routeData.route}`);
          } else {
            alert(routeData.error || "Error adding route");
          }
        } catch (error) {
          console.error("Error fetching route:", error);
          alert("Error fetching route, please try again.");
        }

        // Send the email using the new API route for order confirmation
        try {
          const emailResult = await fetch('/api/send-order-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              senderEmail,
              sender_user_id,
              orderId: data.orderId,
              cost,
            }),
          });

          const emailData = await emailResult.json();
          if (emailResult.ok) {
            alert(`Order confirmation email sent to ${senderEmail}`);
          } else {
            alert(`Failed to send email: ${emailData.message}`);
          }
        } catch (emailError) {
          console.error("Error sending order confirmation email:", emailError);
          alert("Error sending order confirmation email.");
        }
      } else {
        alert(data.error || "Error adding parcel");
      }
    } catch (error) {
      console.error("Error adding parcel:", error);
      alert("Error adding parcel, please try again.");
    }
  };

  return (
    <div className="flex flex-col bg-gray-100">
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

      {/* <main className="flex-grow container mx-auto px-4 py-6 grid grid-cols-2 gap-4">
      <h1>Sorting Hub</h1> */}
        {/* <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="font-bold mb-4 text-lg">Add Parcel</h2>
          <div className="space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-4 mb-4">
                <h3 className="font-semibold text-lg">Sender Details</h3>
              </div>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Sender ID"
                value={parcelData.sender_user_id}
                onChange={(e) => setParcelData({ ...parcelData, sender_user_id: e.target.value })}
              />
              <select
                className="w-full border rounded px-3 py-2 mb-2"
                value={parcelData.senderCity}
                onChange={(e) => setParcelData({ ...parcelData, senderCity: e.target.value })}
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
                  placeholder="Weight (g)"
                  value={parcelData.weight}
                  onChange={(e) => setParcelData({ ...parcelData, weight: e.target.value })}
                />
                <input
                  type="text"
                  className="w-1/2 border rounded px-3 py-2"
                  placeholder="Volume (LxWxH cm)"
                  value={parcelData.volume}
                  onChange={(e) => setParcelData({ ...parcelData, volume: e.target.value })}
                />
              </div>
              <select
                className="w-full border rounded px-3 py-2 mt-2"
                value={parcelData.preference}
                onChange={(e) => setParcelData({ ...parcelData, preference: e.target.value })}
              >
                <option>Preference</option>
                <option>Time</option>
                <option>Cost</option>
              </select>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-4 mb-4">
                <h3 className="font-semibold text-lg">Receiver Details</h3>
              </div>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Receiver ID"
                value={parcelData.receiver_user_id}
                onChange={(e) => setParcelData({ ...parcelData, receiver_user_id: e.target.value })}
              />
              <select
                className="w-full border rounded px-3 py-2 mb-2"
                value={parcelData.receiverCity}
                onChange={(e) => setParcelData({ ...parcelData, receiverCity: e.target.value })}
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
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
              >
                Calculate Cost
              </button>
              {buttonClicked &&
              <p className="text-xl font-semibold">Estimated Cost: ₹{parcelData.cost}</p>}
            </div>
            <button
              onClick={handleAddParcel}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Add Parcel
            </button>
          </div>
        </div> */}
        {/* <div className="w-full bg-white p-6 shadow-md rounded-lg">
          <div className="flex flex-row">
            <div className="w-1/2">
              <h2 className=" font-bold mb-4 text-lg">From</h2>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="Search Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <h2 className="w-1/2 font-bold mb-4 text-lg">To</h2>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="Search Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
          </div>
              <button
                onClick={handleOrderSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Search Order
              </button>
          {orderDetails && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
              <p><strong>Location:</strong> {orderDetails.currentLocation}</p>
              <p><strong>Dispatch ID:</strong> {orderDetails.dispatchId}</p>
              <p><strong>ETA:</strong> {orderDetails.eta}</p>
              <p><strong>Contact:</strong> {orderDetails.contact}</p>
            </div>
          )}
        </div>
      </main>  */}

      <main className="flex-grow container mx-auto px-4 py-6 grid grid-cols-1 gap-4">
        <div className="w-full bg-white p-6 shadow-md rounded-lg">
          <h1 className="font-bold text-2xl text-center mb-6">Sorting Hub</h1>
          <div className="flex flex-row mb-6 justify-center">
            <div className=" px-2">
              <h2 className="font-bold mb-2 text-lg">From</h2>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Search Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <div className="w px-2">
              <h2 className="font-bold mb-2 text-lg">To</h2>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Search Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleOrderSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Search Order
            </button>
          </div>
          {orderDetails && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
              <p><strong>Weight:</strong> {orderDetails.currentLocation}</p>
              <p><strong>Volume</strong> {orderDetails.dispatchId}</p>
              <p><strong>Type of Service</strong> {orderDetails.eta}</p>
              <p><strong>xreated At</strong> {orderDetails.contact}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default withAuth(AdminAddParcel);
