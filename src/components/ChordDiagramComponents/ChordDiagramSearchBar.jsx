import React, { useState } from "react";

import searchIcon from "../../assets/icons/search-interface-symbol.png";
import border from "../../assets/borderStyles/border-one.png";

const ChordDiagramSearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const [chordName, ...rest] = query.split(" ");
    const suffix = rest.join(" ").toLowerCase();
    onSearch(chordName.toUpperCase(), suffix); // Pass the chord name and suffix
  };

  const handleClear = () => {
    setQuery("");
    onSearch("", "");
  };

  return (
    <div className="">
      <div className=" mx-auto px-6 flex flex-col items-center space-y-4">
        <div className="relative w-full max-w-md">
          <img
            src={searchIcon}
            alt="Search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-auto text-gray-500"
          />
          <input
            type="text"
            placeholder="Search for a chord (e.g., C major, D7)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-13 w-full outline-none placeholder-gray-500"
          />
        </div>
        <div className="relative w-full max-w-xs">
          <img src={border} alt="Border" className="w-full h-full opacity-50" />
        </div>

        <div>
          <button
            onClick={handleSearch}
            className="p-3  mr-3 bg-white rounded shadow text-gray-800 font-medium  hover:scale-105 transition-all duration-300 ease-in-out max-w-3xs "
          >
            {" "}
            Submit{" "}
          </button>
          <button
            onClick={handleClear}
            className="p-3 ml-3 bg-white rounded shadow text-gray-800 font-medium  hover:scale-105 transition-all duration-300 ease-in-out max-w-3xs "
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChordDiagramSearchBar;
