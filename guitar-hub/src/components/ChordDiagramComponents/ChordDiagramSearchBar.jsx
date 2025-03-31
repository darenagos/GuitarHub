import React, { useState, useEffect } from "react";

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
        <input
          type="text"
          placeholder="Search for a chord (e.g., C major, D 7)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-3  w-full border-b-2 border-gray-500 outline-none placeholder-gray-500 "
        />

        <div>
          <button
            onClick={handleSearch}
            className="p-3 mr-3 bg-[#F5F0E1] text-gray-800 font-medium  hover:scale-105 transition-all duration-300 ease-in-out max-w-3xs "
          >
            {" "}
            Submit{" "}
          </button>
          <button
            onClick={handleClear}
            className="p-3 ml-3 bg-[#F5F0E1] text-gray-800 font-medium  hover:scale-105 transition-all duration-300 ease-in-out max-w-3xs "
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChordDiagramSearchBar;
