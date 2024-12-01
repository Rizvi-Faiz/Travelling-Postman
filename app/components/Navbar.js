import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-red-600 text-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex space-x-6">
          <Link href="/" className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out">
            Home
          </Link>
          <Link href="/add-manage-parcels" className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out">
            Add/Manage Parcels
          </Link>
          <Link href="/view-routes" className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out">
            View Routes
          </Link>
          <Link href="/track-shipments" className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out">
            Track Shipments
          </Link>
          <Link href="/reports" className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out">
            Reports
          </Link>
        </div>
        <Link href="/logout" className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out">
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
