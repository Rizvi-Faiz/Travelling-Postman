"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const additionalFields =
        role === "User"
          ? { address }
          : role === "Dispatcher"
          ? { location: [latitude, longitude] }
          : {};

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          name,
          email,
          phone,
          username,
          password,
          ...additionalFields,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User created successfully!");
        router.push("/Login");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      alert("Failed to sign up");
    }
  };

  const navigateToLogin = () => {
    router.push("/Login");
  };

  return (
    <div className="bg-white flex flex-col items-center justify-between min-h-screen">
      <Header />

      <div className="w-full max-w-md bg-opacity-60 bg-white p-8 rounded-xl shadow-lg mb-6">
        <div className="mb-6">
          <label htmlFor="role" className="block text-lg mb-2 font-semibold">
            Choose Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Dispatcher">Dispatcher</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="name" className="block text-lg mb-2 font-semibold">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-lg mb-2 font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="phone" className="block text-lg mb-2 font-semibold">
            Phone Number
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>

        {role === "User" && (
          <div className="mb-6">
            <label htmlFor="address" className="block text-lg mb-2 font-semibold">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
        )}

        {role === "Dispatcher" && (
          <>
            <div className="mb-6">
              <label htmlFor="latitude" className="block text-lg mb-2 font-semibold">
                Latitude
              </label>
              <input
                id="latitude"
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Enter latitude"
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="longitude" className="block text-lg mb-2 font-semibold">
                Longitude
              </label>
              <input
                id="longitude"
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Enter longitude"
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </div>
          </>
        )}

        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-lg mb-2 font-semibold"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-lg mb-2 font-semibold"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-lg mb-2 font-semibold"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={handleSignUp}
            className="bg-red-700 text-white px-6 py-2 rounded-lg text-lg"
          >
            Sign Up
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <button
              onClick={navigateToLogin}
              className="text-red-700 font-semibold"
            >
              Login here
            </button>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
