import React from "react";

const SongSearchBar = ({ query, setQuery, onSearch }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search for a song"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar p-3 border-b-2 border-gray-500 outline-none placeholder-gray-500 text-lg "
      />
      <button
        onClick={onSearch}
        className="p-3 ml-5 rounded-xl hover:scale-105 transition duration-300 ease-in-out"
      >
        Search
      </button>
    </div>
  );
};

export default SongSearchBar;
