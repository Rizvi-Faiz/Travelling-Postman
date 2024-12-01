"use client"
import { useState, useEffect } from 'react';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/user');
                const data = await res.json();
                setUser(data); 
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const logout = () => {
        alert("Logged out!");
       
    };

    if (!user) {
        return <div>Loading...</div>; 
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="w-full bg-white shadow p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/logo.png" alt="Logo" className="w-10 h-10" />
                    <h1 className="ml-4 text-xl">Welcome {user.name}!</h1>
                </div>
                <div className="relative">
                    <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
                        <span className="mr-2">{user.username}</span>
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg">
                            <ul>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => alert('Profile clicked')}>
                                    Profile
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={logout}>
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            <main className="w-full max-w-4xl p-4">
                <h2 className="text-2xl mb-4">Track Your Order!</h2>
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 p-4 border border-gray-300">
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                            <span>Map (integrate with actual map API)</span>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 p-4">
                        <div className="mb-4">
                            <label className="block mb-2">Tracking ID:</label>
                            <div className="flex">
                                <input type="text" className="flex-grow p-2 border border-gray-300 rounded-l" />
                                <button className="p-2 bg-blue-500 text-white rounded-r">Enter</button>
                            </div>
                        </div>
                        <div className="border border-gray-300">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-2 border-r border-gray-300">#</th>
                                        <th className="p-2 border-r border-gray-300">Shipment History</th>
                                        <th className="p-2">Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-2 border-r border-gray-300">1</td>
                                        <td className="p-2 border-r border-gray-300">Id, not From-to, Date/Time</td>
                                        <td className="p-2">Cost</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 border-r border-gray-300">2</td>
                                        <td className="p-2 border-r border-gray-300">Id, not From-to, Duration</td>
                                        <td className="p-2">Cost</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
