import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 bg-[#FAF9F6] shadow-2xs w-full z-50 py-5">
      <div className="flex justify-center space-x-6">
        <Link to="/homepage" className="text-black hover:text-gray-600">
          Homepage
        </Link>
        <Link to="/learning" className="text-black hover:text-gray-600">
          Learning
        </Link>
        <Link to="/chord-diagrams" className="text-black hover:text-gray-600">
          Chord Diagrams
        </Link>
        <Link to="/my-songs" className="text-blakc hover:text-gray-600">
          My Songs
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
