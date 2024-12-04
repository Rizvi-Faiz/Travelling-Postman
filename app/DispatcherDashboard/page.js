"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "/public/Logo.png";
import withAuth from "@/lib/withAuth";
import DispatcherNavbar from "../components/dispatcherNavbar";

const DispatcherDashboard = () => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const role = localStorage.getItem("role");
        if(role ==="Dispatcher") {
        setUsername(storedUsername );
        }
        else{
            // alert("Unauthorized Access! Please login as a dispatcher.");
            window.location.href = "/Login";
        }
    }, []);


    
    const orderData = [
        { orderId: "ORD001", src: "Mumbai", dest: "Delhi", dispatchDate: "2024-11-25", deliveryDate: "2024-11-27", delivered: true, delay: 2 },
        { orderId: "ORD002", src: "Chennai", dest: "Kolkata", dispatchDate: "2024-11-22", deliveryDate: "2024-11-24", delivered: true, delay: 2 },
        { orderId: "ORD003", src: "Bangalore", dest: "Pune", dispatchDate: "2024-11-20", deliveryDate: "2024-11-21", delivered: false, delay: 1 },
        { orderId: "ORD004", src: "Hyderabad", dest: "Mumbai", dispatchDate: "2024-11-23", deliveryDate: "2024-11-26", delivered: true, delay: 3 },
        { orderId: "ORD005", src: "Delhi", dest: "Bangalore", dispatchDate: "2024-11-19", deliveryDate: "2024-11-21", delivered: false, delay: 2 },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="relative bg-white shadow-md">
                <div className="flex items-center justify-center px-8 py-4 relative">
                    <div className="absolute left-4">
                        <Image src={Logo} alt="Postman Logo" width={120} height={120} />
                    </div>
                    <h1 className="text-4xl font-bold text-red-700 text-center">
                        Welcome {username}!
                    </h1>
                </div>
                <div className="bg-red-700 h-4 w-full"></div>
            </header>

            {/* Custom Navbar */}
            <DispatcherNavbar />

            {/* Content Section */}
            <div className="flex-grow flex flex-col items-center px-8 py-6 overflow-auto">
                {/* Dispatcher Table */}
                <div className="bg-white shadow-xl rounded-lg w-full max-w-6xl p-6">
                    <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">Order Details</h2>
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="px-4 py-2 border font-semibold text-gray-600">Order ID</th>
                                <th className="px-4 py-2 border font-semibold text-gray-600">Source</th>
                                <th className="px-4 py-2 border font-semibold text-gray-600">Destination</th>
                                <th className="px-4 py-2 border font-semibold text-gray-600">Date of Dispatch</th>
                                <th className="px-4 py-2 border font-semibold text-gray-600">Date of Delivery</th>
                                <th className="px-4 py-2 border font-semibold text-gray-600">Delivered</th>
                                <th className="px-4 py-2 border font-semibold text-gray-600">Delay (Days)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderData.map((order, index) => (
                                <tr key={index} className="hover:bg-gray-50 text-sm">
                                    <td className="px-4 py-2 border text-gray-800">{order.orderId}</td>
                                    <td className="px-4 py-2 border text-gray-800">{order.src}</td>
                                    <td className="px-4 py-2 border text-gray-800">{order.dest}</td>
                                    <td className="px-4 py-2 border text-gray-800">{order.dispatchDate}</td>
                                    <td className="px-4 py-2 border text-gray-800">{order.deliveryDate}</td>
                                    <td className="px-4 py-2 border text-gray-800">
                                        <span className={`font-semibold ${order.delivered ? "text-green-600" : "text-red-600"}`}>
                                            {order.delivered ? "Yes" : "No"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border text-gray-800">{order.delay}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-sm text-center w-full mt-12 pb-6">
                <p>Contact Admin: +91 (719) 581-7902 || abc@gmail.com</p>
            </footer>
        </div>
    );
};

export default withAuth(DispatcherDashboard);
