import React, { useState } from "react";
import { Link } from "react-router-dom";
import FadePageWrapper from "../HOC/FadePageWrapper";

import musicNoteIcon from "../../assets/icons/music-note-icon.png"; // Import the music note icon
import searchIcon from "../../assets/icons/search-interface-symbol.png"; // Import the search icon

const UserCustomSongList = ({ userSongs }) => {
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // Filter songs based on the search term
  const filteredSongs = userSongs.filter((song) =>
    song.song_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort the filtered songs
  const sortedSongs = [...filteredSongs].sort((a, b) => {
    return sortOrder === "desc"
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at);
  });

  return (
    <div className="flex justify-center items-center w-full max-w-full pt-15">
      <div className="p-6">
        <div className="p-2 pb-15 flex justify-center items-center ">
          <h2 className=" text-2xl mr-2">My Created Songs</h2>
          <img src={musicNoteIcon} className="h-10 w-auto" />
        </div>

        {/* Search Input */}
        <div className="flex items-center mb-3 border-2 border-gray-100 rounded-md px-3 bg-white">
          <img src={searchIcon} alt="Search" className="h-7 w-auto mr-2" />
          <input
            type="text"
            placeholder="Search for a song..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 w-full outline-none"
          />
        </div>

        {/* Sort Button */}
        <button
          onClick={handleSort}
          className="cursor-pointer px-3 py-1 flex items-center rounded hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Date added{" "}
          <span
            className={`ml-2 transform transition-transform duration-300 ${
              sortOrder === "desc" ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </button>

        <FadePageWrapper>
          {sortedSongs.length > 0 ? (
            <ul className="grid justify-center bg-white rounded-lg shadow p-3 mt-4">
              {sortedSongs.map((song) => (
                <div className="p-2 w-xl text-center" key={song.id}>
                  <li className="w-full flex rounded-lg">
                    <Link
                      to={`/user-songs/${song.id}`}
                      className=" w-full p-2 hover:scale-105 drop-shadow-[0_4px_2px_rgba(0,0,0,0.1)] rounded-lg transition-all duration-300 ease-in-out"
                    >
                      {song.song_name}{" "}
                    </Link>
                  </li>
                </div>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600">No songs found.</p>
          )}
        </FadePageWrapper>
      </div>
    </div>
  );
};

export default UserCustomSongList;
