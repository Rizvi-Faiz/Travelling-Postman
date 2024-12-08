"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Logo from "/public/Logo.png";
import Image from "next/image";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import IndiaMap from '../components/IndiaMap';

const TrackShipment = () => {
    const [username, setUsername] = useState("");
    const [idEnter, setIdEnter] = useState(false);
    const [reroute, setReroute] = useState(false);
    const [dispatcherId, setDispatcherId] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null); // Track selected route
    const [mapData,setMapData]=useState(null);
    const [alternateRoutes,setAlternateRoutes]=useState(null);

    const route = useRouter();

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");
        if (storedRole === "Admin" && storedUsername) {
            setUsername(storedUsername);
        } else {
            route.push("/Login");
        }
    }, [route]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        route.push("/Login");
        alert("Logged out!");
    };

    const handleInputChange = (e) => {
        setDispatcherId(e.target.value);
    };

    const handleConsignment = async () => {
        if (dispatcherId.trim() === '') {
            alert('Please enter a tracking ID');
        } else {
            try {
                const response = await fetch(`/api/getRouteDetails?dispatcherId=${dispatcherId}`);
                const data = await response.json();
                if (data.success) {
                    const { currentAddress, source, destination,path } = data.routeDetails;
                    console.log("Current Address ",currentAddress);
                    setIdEnter(true);
                    setMapData({ source, destination, currentAddress });
                } else {
                    alert(data.message || 'Failed to fetch route details.');
                }
            } catch (error) {
                console.error('Error fetching route details:', error);
            }
        }
    };


    const handleRoute = async () => {
        try {
            const response = await fetch(`/api/getAlternateRoutes?source=${mapData.source}&destination=${mapData.destination}`);
            const data = await response.json();
            if (data.success) {
                setAlternateRoutes(data.routes);
                setReroute(true);
            } else {
                alert(data.message || 'Failed to fetch alternate routes.');
            }
        } catch (error) {
            console.error('Error fetching alternate routes:', error);
        }
    };


    const handleCheckboxChange = (route) => {
        setSelectedRoute((prevRoute) => (prevRoute === route ? null : route));
    };

    const handleUpdatedRoute = () => {
        if (!selectedRoute) {
            alert("Please select one route to update.");
        } else {
            alert(`Updated route: ${selectedRoute}`);
        }
    };

    return (
        <div className=" bg-gray-100">
            <header className="relative bg-white">
                <div className="flex items-center justify-center px-8 py-8 relative">
                    <div className="absolute left-4">
                        <Image src={Logo} alt="Postman Logo" width={120} height={120} />
                    </div>
                    <h1 className="text-4xl font-bold text-red-700 text-center">
                        Welcome {username}!
                    </h1>
                </div>
            </header>
            <Navbar />

            <main className="w-full max-w-full p-4 flex flex-col space-y-8">
                <h2 className="text-2xl mb-4">Track the Dispatcher!</h2>
                <div className="flex flex-col md:flex-row w-full justify-between space-y-4 md:space-y-0">
                    <div className="w-full md:w-1/2 p-4 border border-gray-300 flex flex-col items-center justify-center">
                        {/* <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                            <span>Map (integrate with actual map API)</span>
                        </div> */}
                        <section className="w-full p-4 border border-gray-300">
                            <IndiaMap
                                source={mapData?.source}
                                destination={mapData?.destination}
                                currentAddress={mapData?.currentAddress}
                            />

                        </section>

                        <p>Current route : {} </p>
                    </div>

                    <div className="w-full md:w-1/2 p-4 flex flex-col items-center">
                        <div className="mb-4 w-full">
                            <label className="block mb-2">Dispatcher ID:</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    className="flex-grow p-2 border border-gray-300 rounded-l"
                                    value={dispatcherId}
                                    onChange={handleInputChange}
                                />
                                <button
                                    className="p-2 bg-blue-500 text-white rounded-r"
                                    onClick={handleConsignment}
                                >
                                    Enter
                                </button>
                            </div>
                        </div>
                        {idEnter && (
                            <div className="w-full flex flex-row justify-between items-center mb-4">
                                <div className="flex flex-row items-center space-x-2">
                                    <h2 className="font-semibold">Current Location:</h2>
                                    <p className="font-bold text-gray-800">{mapData.currentAddress}</p>
                                </div>
                                <button
                                    onClick={handleRoute}
                                    className="p-2 bg-red-700 text-white rounded hover:bg-red-800 transition duration-200"
                                >
                                    Re-route
                                </button>
                            </div>
                        )}
                        {reroute && (
                            <div className="w-full flex flex-col ">
                                <table className="border border-gray-300 w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="p-2 border-r border-gray-300">Select</th>
                                            <th className="p-2 border-r border-gray-300">Current Location -{'>'} Destination</th>
                                            <th className="p-2 border-r border-gray-300">ETA</th>
                                            <th className="p-2 border-r border-gray-300">Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {[
                                            { route: "C.L. - A - C - Dest.", eta: "+1 Day", cost: "+Rs.50" },
                                            { route: "C.L. - B - E - C - Dest.", eta: "+2 Days", cost: "+Rs.150" },
                                            { route: "C.L. - A - F - E - C - Dest.", eta: "+3 Days", cost: "+Rs.75" },
                                        ].map((item, index) => (
                                            <tr key={index}>
                                                <td className="p-2 border-r border-gray-300">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox"
                                                        checked={selectedRoute === item.route}
                                                        onChange={() => handleCheckboxChange(item.route)}
                                                    />
                                                </td>
                                                <td className="p-2 border-r border-gray-300">{item.route}</td>
                                                <td className="p-2 border-r border-gray-300">{item.eta}</td>
                                                <td className="p-2 border-r border-gray-300">{item.cost}</td>
                                            </tr>
                                        ))} */}

                                        {alternateRoutes.map((route, index) => (
                                            <tr key={index}>
                                                <td className="p-2 border-r border-gray-300">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox"
                                                        checked={selectedRoute === route.path}
                                                        onChange={() => handleCheckboxChange(route.path)}
                                                    />
                                                </td>
                                                <td className="p-2 border-r border-gray-300">{route.path}</td>
                                                <td className="p-2 border-r border-gray-300">{route.duration}</td>
                                                <td className="p-2 border-r border-gray-300">{route.cost}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    className="mt-4 p-2 bg-red-700 text-white rounded w-1/4"
                                    onClick={handleUpdatedRoute}
                                >
                                    Update Route
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TrackShipment;
