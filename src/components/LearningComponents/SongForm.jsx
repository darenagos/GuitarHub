import React, { useState } from "react";
import CustomDropdown from "./CustomDropdown";
import learningIcon from "../../assets/icons/learning-icon.jpg";

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
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${API_KEY}&format=json&limit=50&name=${encodeURIComponent(
          query
        )}`
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
    <div className="flex justify-center items-center pt-10">
      <div className=" bg-white p-3 rounded shadow grid grid-cols-3 gap-4  mx-auto">
        <h1 className="flex items-center justify-center gap-x-2 col-span-3 text-gray-500 text-center border-b-2 border-gray-100 pb-2 mb-4">
          Add a Song
          <img src={learningIcon} className="h-7 w-auto" alt="Learning Icon" />
        </h1>

        {/* First Column - Song Name Input */}
        <input
          type="text"
          placeholder="Name of song: "
          value={songToLearn}
          onChange={handleInputChange}
          className="p-2 border-b-2 border-gray-100 outline-none w-full"
        />
        {suggestions.length > 0 && (
          <ul className="col-span-3 border border-gray-100 mt-2 max-h-40 overflow-auto">
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
          className="p-2 border-b-2 border-gray-100 outline-none w-full"
        />

        {/* Third Column - Custom Dropdown */}
        <CustomDropdown
          options={[
            { label: "Want to Learn", value: "want_to_learn" },
            { label: "Learning", value: "learning" },
            { label: "Mastered", value: "mastered" },
          ]}
          selectedValue={status}
          onChange={setStatus}
          className="w-full"
        />

        {/* Button Below Grid (Centered) */}
        <button
          onClick={addSongToWantToLearn}
          className={`col-span-3 ml-60 mr-60 mb-2 p-3 rounded-full border-2 border-gray-100  font-medium transition-all duration-300 ease-in-out cursor-pointer 
    ${
      status === "want_to_learn"
        ? "text-[#A7C85F] hover:shadow-[0_0_10px_4px_rgba(197,217,122,1)]"
        : status === "learning"
        ? "text-[#1abc9c] hover:shadow-[0_0_10px_4px_rgba(118,215,196,0.8)]"
        : status === "mastered"
        ? "text-yellow-500 hover:shadow-[0_0_10px_4px_rgba(255,220,2,0.6)]"
        : "text-gray-500 hover:shadow-[0_0_10px_4px_rgba(156,163,175,0.8)]"
    }`}
        >
          Add Song to {status.replace(/_/g, " ").toUpperCase()}
        </button>
      </div>
    </div>
  );
};

export default SongForm;
