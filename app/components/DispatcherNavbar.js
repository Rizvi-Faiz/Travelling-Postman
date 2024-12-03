import Link from "next/link";
import React from "react";

const DispatcherNavbar = () => {
    return (
        <nav className="bg-red-700 shadow-md sticky top-0 z-10">
            <div className="max-w-screen-xl mx-auto px-8 py-4 flex justify-between items-center">
                {/* Brand Name */}
                {/* <div className="text-white font-bold text-xl">
                    Dispatcher Dashboard
                </div> */}

                {/* Navigation Links */}
                <div className="flex space-x-8">
                    <Link href="/DispatcherDashboard" className="text-white hover:text-gray-300">
                        Home
                    </Link>
                    <Link href="/contact-admin" className="text-white hover:text-gray-300">
                        Contact Admin
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default DispatcherNavbar;
