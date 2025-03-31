import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import FadePageWrapper from "../HOC/FadePageWrapper";

const UserCustomSongList = ({ userSongs }) => {
  const [sortOrder, setSortOrder] = useState("desc");

  const handleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const sortedSongs = [...userSongs].sort((a, b) => {
    return sortOrder === "desc"
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at);
  });

  return (
    <div className="flex justify-center items-center w-full max-w-full">
      <div className="p-3">
        <h2 className="m-5">My Created Songs :</h2>
        <button
          onClick={handleSort}
          className="cursor-pointer px-3 py-1 transition flex items-center"
        >
          <span
            className={`transform transition-transform duration-300 ${
              sortOrder === "desc" ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </button>

        <FadePageWrapper>
          <ul className="grid justify-center">
            {sortedSongs.map((song) => (
              <div className="p-2 w-xl text-center">
                <li
                  className=" border rounded-sm p-2 hover:bg-[#ffff] transition-all duration-300 ease-in-out"
                  key={song.id}
                >
                  <Link to={`/user-songs/${song.id}`}>{song.song_name}</Link>
                </li>
              </div>
            ))}
          </ul>
        </FadePageWrapper>
      </div>
    </div>
  );
};

export default UserCustomSongList;
