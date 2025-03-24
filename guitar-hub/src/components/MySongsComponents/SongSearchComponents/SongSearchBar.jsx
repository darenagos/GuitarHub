import React from "react";

const SongSearchBar = ({ query, setQuery, onSearch }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search for a song"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar"
      />
      <button onClick={onSearch}>Search</button>
    </div>
  );
};

export default SongSearchBar;
