"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import withAuth from "@/lib/withAuth";
import Logo from "/public/Logo.png";
import Image from "next/image";
import Papa from "papaparse";
import { useRouter } from "next/navigation";

const AdminAddParcel = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button

  const router = useRouter();

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
        const response = await fetch("/data/Indian_cities.csv");
        const csvText = await response.text();
        const { data } = Papa.parse(csvText, { header: true });
        setCities(data);
      } catch (error) {
        console.error("Error reading cities file:", error);
      }
    };

    loadCities();
  }, [router]);

  const handleOrderSearch = async () => {
    try {
      const senderCityObj = cities.find((city) => city.Pincode === String(senderId));
      const receiverCityObj = cities.find((city) => city.Pincode === String(receiverId));

      if (!senderCityObj || !receiverCityObj) {
        alert("Invalid sender or receiver pincode. Please check and try again.");
        return;
      }

      const senderCityName = senderCityObj.City;
      const receiverCityName = receiverCityObj.City;

      const response = await fetch("/api/Ordertabledisplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderCity: senderCityName,
          receiverCity: receiverCityName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data.orders || []);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("An error occurred while fetching orders. Please try again.");
    }
  };

  const handleAssignOrders = async () => {
    setIsLoading(true);
    try {
      const updatedOrders = await Promise.all(
        orderDetails.map(async (order) => {
          const senderCityObj = cities.find((city) => city.Pincode === String(senderId));
          const receiverCityObj = cities.find((city) => city.Pincode === String(receiverId));
  
          if (!senderCityObj || !receiverCityObj) {
            alert("Invalid sender or receiver pincode. Please check and try again.");
            return { ...order, assigned: "Not Placed" };
          }
  
          const senderCityName = senderCityObj.City;
          const receiverCityName = receiverCityObj.City;
  
          const response = await fetch("/api/routes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              senderCity: senderCityName,
              receiverCity: receiverCityName,
              preference: order.preference,
              weight: order.weight,
              orderId: order.order_id,
            }),
          });
  
          if (response.ok) {
            const result = await response.json();
            return { ...order, assigned: "Placed" }; // Set assigned to Placed
          } else {
            return { ...order, assigned: "Not Placed" }; // Set assigned to Not Placed
          }
        })
      );
  
      setOrderDetails(updatedOrders); // Update the order details with the assigned status
    } catch (error) {
      console.error("Error assigning orders:", error);
    }
    setIsLoading(false);
  };
  

  return (
    <div className="h-full flex flex-col bg-gray-100">
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
      <main className="flex-grow container mx-auto px-4 py-6 grid grid-cols-1 gap-4">
        <div className="w-full bg-white p-6 shadow-md rounded-lg">
          <h1 className="font-bold text-2xl text-center mb-6">Sorting Hub</h1>
          <div className="flex flex-row mb-6 justify-center">
            <div className="px-2">
              <h2 className="font-bold mb-2 text-lg">From</h2>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Sender ID"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
              />
            </div>
            <div className="px-2">
              <h2 className="font-bold mb-2 text-lg">To</h2>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Receiver ID"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleOrderSearch}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Search Order
            </button>
          </div>

          {orderDetails && orderDetails.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Orders From {senderId} To {receiverId}</h3>
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Order ID</th>
                    <th className="border border-gray-300 px-4 py-2">Weight</th>
                    <th className="border border-gray-300 px-4 py-2">Volume</th>
                    <th className="border border-gray-300 px-4 py-2">Type of Service</th>
                    <th className="border border-gray-300 px-4 py-2">Cost</th>
                    <th className="border border-gray-300 px-4 py-2">Assigned</th> {/* New Assigned Column */}
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.map((order,index) => (
                    <tr key={order.orderId}>
                      <td className="border border-gray-300 px-4 py-2">{order.order_id}</td>
                      <td className="border border-gray-300 px-4 py-2">{order.weight}</td>
                      <td className="border border-gray-300 px-4 py-2">{order.volume}</td>
                      <td className="border border-gray-300 px-4 py-2">{order.preference}</td>
                      <td className="border border-gray-300 px-4 py-2">{order.cost}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {order.assigned || "Not Assigned"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleAssignOrders}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
              disabled={isLoading} // Disable while loading
            >
              {isLoading ? "Assigning..." : "Assign Orders"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default withAuth(AdminAddParcel);
