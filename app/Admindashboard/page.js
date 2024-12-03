"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "/public/Logo.png";
import Navbar from "../components/Navbar";
import withAuth from "@/lib/withAuth";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController } from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

const AdminDashboard = () => {
    const [username, setUsername] = useState("");
    const [delayData, setDelayData] = useState(null);
    const [inputId, setInputId] = useState("");
    const chartRef = useRef(null); // Create a reference for the chart

    useEffect(() => {
        // Retrieve the username from localStorage
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            // Default to "Admin" if username is not available
            setUsername("Admin");
        }

        // Generate random data for dispatcher delays
        generateRandomData();
    }, []);

    // Generate random dispatcher data (100 values)
    const generateRandomData = () => {
        const data = [];
        for (let i = 1; i <= 100; i++) {
            data.push({
                dispatcherId: `D${i}`,
                delay: Math.floor(Math.random() * 100) + 1, // Random delay between 1 and 100 days
                phone: `+91 1234 5678 ${i}`, // Sample phone number
                email: `dispatcher${i}@example.com`, // Sample email
            });
        }

        // Sort the data by delay in descending order and select the top 10
        const sortedData = data.sort((a, b) => b.delay - a.delay).slice(0, 10);
        setDelayData(sortedData);
    };

    // Handle input and fetch delay for the specific dispatcher
    const handleDispatcherInput = () => {
        if (delayData) {
            const found = delayData.find(item => item.dispatcherId === inputId);
            if (found) {
                alert(`Dispatcher ${inputId} has a delay of ${found.delay} days. Phone: ${found.phone}, Email: ${found.email}`);
            } else {
                // Search the entire data, not just top 10
                const allData = Array.from({ length: 100 }, (_, i) => ({
                    dispatcherId: `D${i + 1}`,
                    delay: Math.floor(Math.random() * 100) + 1,
                }));
                const dispatcher = allData.find(item => item.dispatcherId === inputId);
                if (dispatcher) {
                    alert(`Dispatcher ${inputId} has a delay of ${dispatcher.delay} days.`);
                } else {
                    alert("Dispatcher ID not found.");
                }
            }
        }
    };

    // Prepare chart data
    const chartData = {
        labels: delayData ? delayData.map(item => item.dispatcherId) : [],
        datasets: [
            {
                label: 'Delay in Days',
                data: delayData ? delayData.map(item => item.delay) : [],
                backgroundColor: 'rgba(54, 162, 235, 0.8)', // Light blue background color for bars
                borderColor: 'rgba(54, 162, 235, 1)', // Blue border color for bars
                borderWidth: 1,
            },
        ],
    };

    // Create the chart after component mounts
    useEffect(() => {
        if (chartRef.current && delayData) {
            const ctx = chartRef.current.getContext("2d");

            new ChartJS(ctx, {
                type: 'bar', // Using 'bar' as the chart type
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Dispatcher Delay Chart',
                            font: {
                                size: 18,
                            },
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: {
                                size: 14,
                            },
                            bodyFont: {
                                size: 12,
                            },
                        },
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                        },
                        y: {
                            beginAtZero: true,
                            max: 100,
                        },
                    },
                },
            });
        }
    }, [delayData]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Fixed Header and Navbar */}
            <header className="relative bg-white shadow-md">
                <div className="flex items-center justify-center px-8 py-4 relative">
                    {/* Logo */}
                    <div className="absolute left-4">
                        <Image src={Logo} alt="Postman Logo" width={120} height={120} />
                    </div>

                    {/* Welcome Message */}
                    <h1 className="text-4xl font-bold text-red-700 text-center">
                        Welcome {username} !
                    </h1>
                </div>
                {/* Red Bar Below Header */}
                <div className="bg-red-700 h-4 w-full"></div>
            </header>
            <Navbar />

            {/* Content Section */}
            <div className="flex-grow flex gap-6 px-8 py-4 overflow-auto">
                {/* Left Section: Chart */}
                <div className="flex-1 bg-white shadow-xl rounded-lg p-6">
                    {/* Input to find delay for a dispatcher */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Enter Dispatcher ID (e.g., D5)"
                            value={inputId}
                            onChange={(e) => setInputId(e.target.value)}
                            className="border p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                        <button onClick={handleDispatcherInput} className="ml-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                            Get Delay
                        </button>
                    </div>

                    {/* Chart */}
                    <div className="w-full" style={{ height: "400px" }}>
                        <canvas ref={chartRef}></canvas> {/* Use the canvas for chart rendering */}
                    </div>
                </div>

                {/* Right Section: Stats */}
                <div className="flex-1 grid grid-cols-2 gap-6">
                    {/* Card 1: Total Deliveries Completed */}
                    <div className="bg-white shadow-xl rounded-lg p-6 text-center transform hover:scale-105 transition duration-300 ease-in-out">
                        <h3 className="text-2xl font-semibold text-gray-700">Total Deliveries Completed</h3>
                        <p className="text-4xl font-bold text-green-600">4357</p>
                    </div>
                    
                    {/* Card 2: Pending Deliveries */}
                    <div className="bg-white shadow-xl rounded-lg p-6 text-center transform hover:scale-105 transition duration-300 ease-in-out">
                        <h3 className="text-2xl font-semibold text-gray-700">Pending Deliveries</h3>
                        <p className="text-4xl font-bold text-red-600">870</p>
                    </div>
                    
                    {/* Card 3: Average Delivery Time */}
                    <div className="bg-white shadow-xl rounded-lg p-6 text-center transform hover:scale-105 transition duration-300 ease-in-out">
                        <h3 className="text-2xl font-semibold text-gray-700">Average Delivery Time</h3>
                        <p className="text-4xl font-bold text-purple-600">35 hours/order</p>
                    </div>

                    {/* Card 4: New Dispatchers */}
                    <div className="bg-white shadow-xl rounded-lg p-6 text-center transform hover:scale-105 transition duration-300 ease-in-out">
                        <h3 className="text-2xl font-semibold text-gray-700">New Dispatchers</h3>
                        <p className="text-4xl font-bold text-blue-600">12</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-sm text-center w-full mt-12 pb-6 mb-0">
                <div className="mb-4">
                    <p>Contact Us: +91 (719) 581-7902 || abc@gmail.com</p>
                </div>

                <div className="bg-red-700 h-4 w-full"></div>
            </footer>
        </div>
    );
};

export default withAuth(AdminDashboard);
