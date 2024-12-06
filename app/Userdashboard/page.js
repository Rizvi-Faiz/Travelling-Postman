"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "/public/Logo.png";
import Image from "next/image";
import Footer from "../components/Footer";
import IndiaMap from "../components/IndiaMap";

const UserDashboard = () => {
  const [username, setUsername] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [idEntered, setIdEntered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Retrieve role from localStorage
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    // Check if user is logged in and has the 'User' role
    if (role !== "User") {
      router.push("/Login");
    } else {
      // Fetch username from localStorage
      const username = localStorage.getItem("username");
      if (username) {
        setUsername(username);
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

  const handleConsignment = () => {
    if (!trackingId.trim()) {
      alert("Please enter a tracking ID");
      return;
    }
    setIdEntered(true);
  };

  if (!username) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100">
      <header className="relative flex items-center justify-between px-7 mt-8 mb-4">
        <Image src={Logo} alt="Postman Logo" width={120} height={120} />
        <h1 className="text-4xl font-bold text-red-700 absolute left-1/2 transform -translate-x-1/2">
          Welcome {username}
        </h1>
        <div className="absolute right-7 cursor-pointer" onClick={toggleDropdown}>
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

      <main className="p-4 flex flex-col space-y-8">
        <h2 className="text-2xl">Track Your Order!</h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0">
          <section className="w-full md:w-1/2 p-4 border border-gray-300">
            <IndiaMap />
          </section>

          <section className="w-full md:w-1/2 p-4">
            {idEntered ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Consignment Number: <span className="font-bold">{trackingId}</span>
                </h2>
                {/* Display consignment details here */}
              </div>
            ) : (
              <div>
                <div className="flex mb-4">
                  <input
                    type="text"
                    className="flex-grow p-2 border border-gray-300 rounded-l"
                    placeholder="Enter Tracking ID"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                  />
                  <button
                    className="p-2 bg-blue-500 text-white rounded-r"
                    onClick={handleConsignment}
                  >
                    Enter
                  </button>
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
