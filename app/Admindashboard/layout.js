// layout.js
import React from "react";

const AdminLayout = ({ children }) => {
    return (
        // <div className="min-h-screen bg-gray-100">
        //     {/* Header */}
        //     <header className="bg-red-700 text-white py-4">
        //         <div className="container mx-auto flex items-center justify-between">
        //             <div className="flex items-center">
        //                 <img src="/Logo.png" alt="Travelling Postman Logo" className="h-16 mr-4" />
        //                 <h1 className="text-2xl font-bold">Travelling Postman</h1>
        //             </div>
        //             <nav className="space-x-8">
        //                 <a href="#" className="text-lg hover:underline">Home</a>
        //                 <a href="#" className="text-lg hover:underline">Add/Manage Parcels</a>
        //                 <a href="#" className="text-lg hover:underline">View Routes</a>
        //                 <a href="#" className="text-lg hover:underline">Track Shipments</a>
        //                 <a href="#" className="text-lg hover:underline">Reports</a>
        //                 <a href="#" className="text-lg hover:underline text-yellow-300">Logout</a>
        //             </nav>
        //         </div>
        //     </header>

        //     {/* Content */}
        //     <main className="container mx-auto py-8">{children}</main>

        //     {/* Footer */}
        //     <footer className="bg-red-700 text-white py-4 text-center">
        //         <p>Contact Support Number: +91 (719) 581-7902</p>
        //     </footer>
        // </div>
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
};

export default AdminLayout;
