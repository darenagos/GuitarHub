import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="pt-30 pb-20">
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
