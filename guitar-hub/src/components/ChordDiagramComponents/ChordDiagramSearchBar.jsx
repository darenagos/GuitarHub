import React, { useState, useEffect } from "react";

const ChordDiagramSearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const [chordName, ...rest] = query.split(" ");
    const suffix = rest.join(" ").toLowerCase();
    onSearch(chordName.toUpperCase(), suffix); // Pass the chord name and suffix
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a chord (e.g., C major, D7, G# minor)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar"
      />
      <button onClick={handleSearch}> Submit </button>
    </div>
  );
};

export default ChordDiagramSearchBar;
