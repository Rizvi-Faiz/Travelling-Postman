"use client"
import React from "react";
import { useRouter } from "next/navigation"; 
import IndiaMap from "./components/IndiaMap";

function HomePage() {
  const router = useRouter(); 

  
  const navigateToLogin = () => {
    router.push("/Login"); 
  };

  
  const navigateToSignUp = () => {
    router.push("/SignUp"); 
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-gray-100">
      <h1 className="text-center text-3xl font-bold mb-6">
        Welcome to the Travelling Postman
      </h1>

      <div className="flex space-x-4">
        <button
          onClick={navigateToLogin}
          className="bg-red-700 text-white px-6 py-2 rounded-lg"
        >
          Go to Login
        </button>
        <button
          onClick={navigateToSignUp}
          className="bg-red-700 text-white px-6 py-2 rounded-lg"
        >
          Go to Sign Up
        </button>
        {/* <IndiaMap /> */}
      </div>
    </div>
  );
}

export default HomePage;
