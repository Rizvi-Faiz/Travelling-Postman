"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "/public/Logo.png";
import Image from "next/image";
import Footer from "../components/Footer";
import IndiaMap from "../components/IndiaMap";

const UserDashboard = () => {
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;

    if (role !== "User") {
      router.push("/Login");
    } else {
      const username = localStorage.getItem("username");
      const userId = localStorage.getItem("userId");
      if (username) {
        setUsername(username);
        setUserId(userId);
      } else {
        console.error("User data not found in localStorage");
      }
    }
  }, [router]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const logout = () => {
    localStorage.clear();
    router.push("/Login");
    alert("Logged out!");
  };

  const handleOrderTracking = async () => {
    if (!orderId.trim()) {
      alert("Please enter a valid order ID.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/track?order_id=${orderId}`);
      const data = await response.json();

      if (response.ok) {
        setMapData({
          source: data.source,
          destination: data.destination,
          currentAddress: data.currentAddress,
          delay: data.delay,
          status: data.status,
        });
      } else {
        alert(data.error || "Order ID not found or invalid.");
        setMapData(null);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!username || !userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="relative flex items-center justify-between px-7 mt-8 mb-4">
        <Image src={Logo} alt="Postman Logo" width={120} height={120} />
        <h1 className="text-4xl font-bold text-red-700 absolute left-1/2 transform -translate-x-1/2 text-center">
          Welcome {username} <br />
          <span className="text-xl">Your User ID: {userId}</span>
        </h1>
        <div
          className="absolute right-7 cursor-pointer"
          onClick={toggleDropdown}
        >
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-white">{username.charAt(0)}</span>
          </div>
        </div>
        {dropdownOpen && (
          <div className="absolute right-7 top-20 mt-2 w-32 bg-white shadow-lg rounded-lg">
            <ul>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => alert("Profile clicked")}
              >
                Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={logout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </header>

      <div className="bg-red-700 h-4 w-full"></div>

      <main className="p-6">
        <h2 className="text-2xl mb-4 text-center">Track Your Order</h2>

        <div className="flex flex-col gap-6 justify-center items-center">
          <section className="w-full flex flex-col gap-4 items-center">
            {/* Input Box & Track Button */}
            <div className="flex items-center space-x-4 mb-6">
              <input
                type="text"
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <button
                className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
                onClick={handleOrderTracking}
                disabled={loading}
              >
                {loading ? "Loading..." : "Track Order"}
              </button>
            </div>

            {/* Map & Order Details */}
            {mapData && (
              <div className="w-full flex flex-col md:flex-row gap-6 justify-center">
                <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-md">
                  <IndiaMap
                    source={mapData.source}
                    destination={mapData.destination}
                    currentAddress={mapData.currentAddress}
                  />
                </div>

                <div className="w-full md:w-1/2 flex flex-col gap-6">
                  {/* Displaying Order Details in Cards */}
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Source</h3>
                    <p>{mapData.source}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Destination</h3>
                    <p>{mapData.destination}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Current Address</h3>
                    <p>{mapData.currentAddress}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Delay</h3>
                    <p>{mapData.delay ? `${mapData.delay} minutes` : "No delay"}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Status</h3>
                    <p>{mapData.status}</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
