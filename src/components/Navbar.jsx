import React from "react";
import { Link } from "react-router-dom";

import "../index.css";
import dgChordLogo from "../assets/dgChordLogo.png";

/**
 * Navbar Component
 * A fixed navigation bar that provides links to the main sections of the GuitarHub app.
 * navigation links for "Homepage", "Learning", "Chord Diagrams", and "My Songs".
 */

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 bg-[#FAF9F6] shadow-2xs w-full z-50 h-1/10 flex justify-center items-center">
      <div className=" absolute left-5 flex items-center justify-start space-x-2">
        <img
          src={dgChordLogo}
          alt="DG Chord Logo"
          className="h-8 sm:h-17 mr-2"
        />
        <span className="text-2xl font-semibold">GuitarHub</span>
      </div>
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
