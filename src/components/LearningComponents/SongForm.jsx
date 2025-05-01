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
      <div className=" bg-white p-3 rounded shadow grid grid-cols-3 gap-4 mx-auto">
        <div className="col-span-3">
          <h1 className=" relative flex items-center justify-center gap-x-2 text-gray-500 border-b-2 border-gray-100 pb-2 mb-4">
            <span className="group relative cursor-help flex items-center justify-center gap-x-2">
              Add a Song
              <img
                src={learningIcon}
                className="h-7 w-auto"
                alt="Learning Icon"
              />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 w-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-sm rounded p-2 shadow-lg pointer-events-none">
                <p className="text-xs mb-1">How to add a song:</p>
                <ol className="text-xs pl-4 list-decimal">
                  <li>
                    Type a <u>song name</u> to see suggestions
                  </li>
                  <li>
                    Click a <u>suggestion</u>
                  </li>
                  <li>
                    Select song <u>status</u> from dropdown
                  </li>
                  <li>
                    Click <u>Add Song</u> button to save
                  </li>
                </ol>
                <div className="absolute left-1/2 -translate-x-1/2 top-full border-8 border-transparent border-t-gray-800"></div>
              </div>
            </span>
            <div className="group absolute top-0 right-0">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs font-bold cursor-help">
                ?
              </span>
              <div className="absolute right-0 bottom-full mb-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs rounded p-2 shadow-lg pointer-events-none z-10">
                Please note that the song search is powered by <u>Jamendo</u>, a
                platform that provides free and legal music from independent
                artists. Because of this, <u>not all songs may be available</u>{" "}
                in the search results.
                <div className="absolute right-1 top-full border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          </h1>
        </div>

        {/* First Column - Song Name Input */}

        <input
          type="text"
          placeholder="Name of song: "
          value={songToLearn}
          onChange={handleInputChange}
          className="p-2 border-b-2 border-gray-100 outline-none flex-grow"
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
