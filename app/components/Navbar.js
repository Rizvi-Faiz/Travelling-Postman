import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-red-600 text-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Navigation Links */}
        <div className="flex-1 flex justify-evenly">
          <Link
            href="/Admindashboard"
            className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out"
          >
            Home
          </Link>
          <Link
            href="/AdminAddParcel"
            className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out"
          >
            Add/Manage Parcels
          </Link>
          {/* <Link
            href="/view-routes"
            className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out"
          >
            View Routes
          </Link> */}
          <Link
            href="/track-shipments"
            className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out"
          >
            Track Shipments
          </Link>
          <Link
            href="/AdminPerformanceDashboard"
            className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out"
          >
            Performance Dashboard
          </Link>
        </div>

        {/* Logout Link */}
        <div className="ml-6">
          <Link
            href="/logout"
            className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
