// page.js
"use client"
import React from "react";
import Image from "next/image";
import Logo from "/public/Logo.png";
import { useState,useEffect } from "react";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        // Retrieve the username from localStorage
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    
    return (
        <div>
            <header className="relative">
                <div className="absolute left-8">
                    <Image src={Logo} alt="Postman Logo" width={120} height={120} />
                </div>

                <div className="flex flex-col items-center mt-8 mb-4">
                    <h1 className="text-4xl font-bold text-red-700 text-center mb-2">
                        Welcome {username}
                    </h1>
                </div>
                <div className="bg-red-700 top-1 h-4 w-screen"></div>
            </header>
            <Navbar/>
            {/* Title Section */}
            
            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white shadow-md rounded-lg p-4 text-center">
                    <h3 className="text-2xl font-semibold">Total Deliveries Completed</h3>
                    <p className="text-4xl font-bold text-green-600">4357</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 text-center">
                    <h3 className="text-2xl font-semibold">Pending Deliveries</h3>
                    <p className="text-4xl font-bold text-red-600">870</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 text-center">
                    <h3 className="text-2xl font-semibold">Average Delivery Time</h3>
                    <p className="text-4xl font-bold text-purple-600">35 hours/order</p>
                </div>
            </div>

            {/* Revenue Chart Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Revenue and Orders</h2>
                <div>
                    {/* Replace with a charting library like Chart.js */}
                    <div className="h-64 bg-gray-200 flex items-center justify-center">
                        <p>Chart Placeholder</p>
                    </div>
                </div>
            </div>

            {/* Messages Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Messages</h2>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Dispatcher</th>
                            <th className="border border-gray-300 px-4 py-2">Text</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Dispatcher 1</td>
                            <td className="border border-gray-300 px-4 py-2">Content</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Dispatcher 2</td>
                            <td className="border border-gray-300 px-4 py-2">Content</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Dispatcher 3</td>
                            <td className="border border-gray-300 px-4 py-2">Content</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Dispatcher 4</td>
                            <td className="border border-gray-300 px-4 py-2">Content</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <footer className="text-sm text-center w-full mt-12 pb-6 mb-0">
                <div className="mb-4">
                    {/* <p>Contact Us</p> */}
                    <p>Contact Us: +91 (719) 581-7902  || abc@gmail.com</p>
                </div>

                <div className="bg-red-700 h-4 w-full"></div>
            </footer>
        </div>
    );
};

export default AdminDashboard;
