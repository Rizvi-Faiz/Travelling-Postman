import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import withAuth from "@/lib/withAuth";

const AdminAddParcel = () => {
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <Navbar />
      <div className="bg-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center space-x-4">
          <div>
            <label className="block text-sm">Delivery Type</label>
            <select className="w-28 border rounded px-2 py-1 text-sm">
              <option>Intercity</option>
              <option>Intracity</option>
              <option>International</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Weight</label>
            <input
              type="text"
              className="w-28 border rounded px-2 py-1 text-sm"
              placeholder="1 kg"
            />
          </div>
          <div>
            <label className="block text-sm">From</label>
            <input
              type="text"
              className="w-28 border rounded px-2 py-1 text-sm"
              placeholder="Search"
            />
          </div>
          <div>
            <label className="block text-sm">To</label>
            <input
              type="text"
              className="w-28 border rounded px-2 py-1 text-sm"
              placeholder="Search"
            />
          </div>
          <div>
            <label className="block text-sm">Sort By</label>
            <select className="w-28 border rounded px-2 py-1 text-sm">
              <option>Select</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Current Date</label>
            <input
              type="text"
              className="w-28 border rounded px-2 py-1 text-sm"
              value={currentDate}
              readOnly
            />
          </div>
        </div>
      </div>
      <main className="flex-grow container mx-auto px-4 py-6 grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-bold mb-2">Route Map</h2>
          <div className="w-full h-48 border rounded bg-gray-200 flex items-center justify-center">
            <span>Map Placeholder</span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="font-bold mb-1">Roadways</h2>
            <div className="border rounded p-2">
              <div className="mb-1 text-sm">Estimated Delivery: 2 Days</div>
              <div className="mb-1 text-sm">Estimated Cost: ₹500</div>
              <div className="text-sm">Safety: High</div>
            </div>
          </div>
          <div>
            <h2 className="font-bold mb-1">Railways</h2>
            <div className="border rounded p-2">
              <div className="mb-1 text-sm">Estimated Delivery: 3 Days</div>
              <div className="mb-1 text-sm">Estimated Cost: ₹300</div>
              <div className="text-sm">Safety: Medium</div>
            </div>
          </div>
          <div>
            <h2 className="font-bold mb-1">Airways</h2>
            <div className="border rounded p-2">
              <div className="mb-1 text-sm">Estimated Delivery: 1 Day</div>
              <div className="mb-1 text-sm">Estimated Cost: ₹1000</div>
              <div className="text-sm">Safety: High</div>
            </div>
          </div>
        </div>
      </main>

      <div className="container mx-auto text-center py-4">
        <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 active:scale-95 transition-transform">
          Check Alternate Route
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default withAuth(AdminAddParcel);
