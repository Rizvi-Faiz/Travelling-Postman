"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
export default function Login() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password,role }),
      });

      const data = await response.json();
      console.log('API Response:', data); // Debugging
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username); // Store username
        localStorage.setItem('role', role); // Store role

        // Redirect based on role
        if (role === "User") router.push('/Userdashboard');
        else if (role === "Admin") router.push('/Admindashboard');
        else if (role === "Dispatcher") router.push('/DispatcherDashboard');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('Failed to log in');
    }
  };

  const navigateToSignUp = () => {
    router.push("/SignUp");
  };

  return (
    <div className="bg-white flex flex-col items-center justify-between min-h-screen">
      <Header />

      <div className="w-full max-w-md bg-opacity-60 bg-white p-8 rounded-xl shadow-lg mt-4">
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
          <label htmlFor="username" className="block text-lg mb-2 font-semibold">
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
          <label htmlFor="password" className="block text-lg mb-2 font-semibold">
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
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={handleLogin}
            className="bg-red-700 text-white px-6 py-2 rounded-lg text-lg"
          >
            Login
          </button>
        </div>
        <div className="text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <button onClick={navigateToSignUp} className="text-red-700 font-semibold">
              Sign Up here
            </button>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
