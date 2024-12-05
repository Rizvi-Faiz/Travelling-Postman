"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "/public/Logo.png";
import Image from "next/image";
import Footer from "../components/Footer";
import IndiaMap from "../components/IndiaMap";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [idEnter, setIdEnter] = useState(false);
  const router = useRouter();
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null; // Ensure localStorage is accessed on the client

  useEffect(() => {
    if (role !== "User") {
      router.push("/Login"); // Redirect if not a user
    } else {
      const fetchUser = async () => {
        try {
          const res = await fetch("/api/user");
          const data = await res.json();
          setUser(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUser();
    }
  }, [role, router]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    router.push("/Login");
    alert("Logged out!");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (e) => {
    setTrackingId(e.target.value);
  };

  const handleConsignment = () => {
    if (trackingId.trim() === "") {
      alert("Please enter a tracking ID");
    } else {
      // router.push(`/UserConsignmentDetails?trackingId=${encodeURIComponent(trackingId)}`);
      setIdEnter(true);
    }
  };

  return (
    <div className=" bg-gray-100">
      <div className="relative">
        <div className="flex items-center justify-between mt-8 mb-4 px-7">
          {/* Logo Section */}
          <div className="flex items-center">
            <Image src={Logo} alt="Postman Logo" width={120} height={120} />
          </div>

          {/* Welcome Text */}
          <h1 className="text-4xl font-bold text-red-700 text-center flex-grow">
            Welcome {user.name}
          </h1>
          <div
            className="absolute right-7 top-15 cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-white">{user.username}</span>{" "}
              {/* Display initial */}
            </div>
          </div>
          {dropdownOpen && (
            <div className="absolute right-7 top-32 mt-2 w-32 bg-white shadow-lg rounded-lg">
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
        </div>

        <div className="bg-red-700 h-4 w-full"></div>
      </div>

      <main className="w-full max-w-full p-4 flex flex-col  space-y-8">
        <h2 className="text-2xl mb-4">Track Your Order!</h2>
        <div className="flex flex-col md:flex-row w-full justify-between space-y-4 md:space-y-0">
          {/* Map Section */}

          <div className="w-full md:w-1/2 p-4 border border-gray-300">
            <div className="map-container bg-gray-200">
              <IndiaMap />
            </div>
          </div>

          {/* Tracking ID Section */}
          <div className="w-full md:w-1/2 p-4 flex flex-col items-center">
            {idEnter ? (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Consignment Number:{" "}
                  <span className="font-bold">{trackingId}</span>
                </h2>
                <h3 className="text-lg font-semibold mb-2">
                  Consignment Details
                </h3>
                {/* Progress Tracker */}
                <div className="mb-6">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <div className="text-center">
                      <div className="text-green-600">Order placed</div>
                      <div className="text-gray-500">10 Dec</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-600">Packed</div>
                      <div className="text-gray-500">10 Dec</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-600">Hub 1</div>
                      <div className="text-gray-500">11 Dec</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Hub 2</div>
                      <div className="text-gray-500">12 Dec</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Delivered</div>
                      <div className="text-gray-500">13 Dec</div>
                    </div>
                  </div>

                  <div className="flex items-center mt-3">
                    <div className="flex-grow border-t-4 border-green-600"></div>
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    <div className="flex-grow border-t-4 border-green-600"></div>
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    <div className="flex-grow border-t-4 border-green-600"></div>
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    <div className="flex-grow border-t-4 border-gray-300"></div>
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <div className="flex-grow border-t-4 border-gray-300"></div>
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <div className="flex-grow border-t-4 border-gray-300"></div>
                  </div>
                </div>

                {/* Consignment Details */}
                <div className="mb-4">
                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                      Expected Date of Arrival:
                    </label>
                    <p className="text-gray-800">
                      13 December, 2024{" "}
                      <span className="text-gray-500">before 10pm</span>
                    </p>
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                      Delayed by:
                    </label>
                    <p className="text-gray-800">1 day</p>
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                      Reason of Delay:
                    </label>
                    <p className="text-gray-800">Foggy Weather</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-gray-500 text-white rounded">
                    Cancel Order
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded">
                    Download Invoice
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 w-full">
                  <label className="block mb-2">Tracking ID:</label>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-grow p-2 border border-gray-300 rounded-l"
                      value={trackingId}
                      onChange={handleInputChange}
                    />
                    <button
                      className="p-2 bg-blue-500 text-white rounded-r"
                      onClick={handleConsignment}
                    >
                      Enter
                    </button>
                  </div>
                </div>

                {/* Table Section */}
                <div className="border border-gray-300 w-full">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 border-r border-gray-300">#</th>
                        <th className="p-2 border-r border-gray-300">
                          Order Number
                        </th>
                        <th className="p-2 border-r border-gray-300">
                          Date of Arrival
                        </th>
                        <th className="p-2 border-r border-gray-300">Status</th>
                        <th className="p-2 border-r border-gray-300">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-r border-gray-300">1</td>
                        <td className="p-2 border-r border-gray-300">
                          228-3844-931-7689
                        </td>
                        <td className="p-2 border-r border-gray-300">
                          Nov 20, 2022
                        </td>
                        <td
                          className="p-2 border-r border-gray-300"
                          style={{ color: "green", fontWeight: "500" }}
                        >
                          Delivered
                        </td>
                        <td className="p-2 border-r border-gray-300">
                          Rs. 750
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-gray-300">2</td>
                        <td className="p-2 border-r border-gray-300">
                          661-7963-661-7963
                        </td>
                        <td className="p-2 border-r border-gray-300">
                          Aug 05, 2022
                        </td>
                        <td
                          className="p-2 border-r border-gray-300"
                          style={{ color: "red", fontWeight: "500" }}
                        >
                          Returned
                        </td>
                        <td className="p-2 border-r border-gray-300">
                          Rs. 750
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-gray-300">3</td>
                        <td className="p-2 border-r border-gray-300">
                          958-4030-182-0187
                        </td>
                        <td className="p-2 border-r border-gray-300">
                          Jun 23, 2022
                        </td>
                        <td
                          className="p-2 border-r border-gray-300"
                          style={{ color: "green", fontWeight: "500" }}
                        >
                          Delivered
                        </td>
                        <td className="p-2 border-r border-gray-300">
                          Rs. 750
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
