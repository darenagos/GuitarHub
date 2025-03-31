import React, { useState } from "react";
import { Link } from "react-router-dom";
import FadePageWrapper from "../HOC/FadePageWrapper";

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
    <div className="flex justify-center items-center w-full max-w-full">
      <div className="p-3">
        <h2 className="m-5">My Created Songs :</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for a song..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 mb-3 border border-gray-300 rounded w-full"
        />

        {/* Sort Button */}
        <button
          onClick={handleSort}
          className="cursor-pointer px-3 py-1 flex items-center border border-gray-400 rounded"
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
            <ul className="grid justify-center">
              {sortedSongs.map((song) => (
                <div className="p-2 w-xl text-center" key={song.id}>
                  <li className="border rounded-sm p-2 hover:bg-white transition-all duration-300 ease-in-out">
                    <Link to={`/user-songs/${song.id}`}>{song.song_name}</Link>
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
