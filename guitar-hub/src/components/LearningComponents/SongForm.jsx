import React, { useState } from "react";
import CustomDropdown from "./CustomDropdown";

const API_KEY = "05955013";

const SongForm = ({
  addSongToWantToLearn,
  songToLearn,
  setSongToLearn,
  artistOfSongToLearn,
  setArtistOfSongToLearn,
  status,
  setStatus,
}) => {
  const [suggestions, setSuggestions] = useState([]);

  const fetchSongSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${API_KEY}&format=json&limit=8&search=${query}`
      );
      const data = await response.json();
      setSuggestions(data.results);
    } catch (error) {
      console.error("Error fetching song suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    setSongToLearn(e.target.value);
    fetchSongSuggestions(e.target.value);
  };

  const handleSelectSong = (song) => {
    setSongToLearn(song.name);
    setArtistOfSongToLearn(song.artist_name);
    setSuggestions([]); // Hide suggestions
  };

  return (
    <div className="flex justify-center items-center pt-10 px-3 min-w-screen">
      <div className="grid grid-cols-3 gap-4 w-full max-w-lg mx-auto">
        {/* First Column - Song Name Input */}
        <input
          type="text"
          placeholder="Name of song: "
          value={songToLearn}
          onChange={handleInputChange}
          className="p-2 border-b-2 border-gray-500 outline-none w-full"
        />
        {suggestions.length > 0 && (
          <ul className="col-span-3 border border-gray-300 mt-2 max-h-40 overflow-auto">
            {suggestions.map((song) => (
              <li
                key={song.id}
                onClick={() => handleSelectSong(song)}
                className="p-2 hover:bg-[#e3d8b3] cursor-pointer"
              >
                {song.name} - {song.artist_name}
              </li>
            ))}
          </ul>
        )}

        {/* Second Column - Name of Artist Input */}
        <input
          type="text"
          placeholder="Name of artist: "
          value={artistOfSongToLearn}
          onChange={(e) => setArtistOfSongToLearn(e.target.value)}
          className="p-2 border-b-2 border-gray-500 outline-none w-full"
        />

        {/* Third Column - Custom Dropdown */}
        <CustomDropdown
          options={[
            { label: "Want to Learn", value: "want_to_learn" },
            { label: "Currently Learning", value: "currently_learning" },
            { label: "Learnt", value: "learnt" },
          ]}
          selectedValue={status}
          onChange={setStatus}
          className="w-full"
        />

        {/* Button Below Grid (Centered) */}
        <button
          onClick={addSongToWantToLearn}
          className="col-span-3 mt-4 p-3 bg-[#F5F0E1] text-gray-800 font-medium 
        hover:bg-[#e3d8b3] transition-all duration-300 ease-in-out"
        >
          Add Song to {status.replace("_", " ").toUpperCase()}
        </button>
      </div>
    </div>
  );
};

export default SongForm;
