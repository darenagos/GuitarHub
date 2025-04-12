import React from "react";
import { Link } from "react-router";
import FadePageWrapper from "../HOC/FadePageWrapper";

const RecentSongsList = ({ songs, loading, error }) => {
  return (
    <FadePageWrapper>
      <div className="border rounded-md shadow-md h-full">
        <h3 className="text-xl font-semibold border-b p-3  ">Recent Songs</h3>

        {error ? (
          <p>Error fetching songs: {error.message}</p>
        ) : songs.length > 0 ? (
          songs.slice(0, 3).map((song) => (
            <div
              key={song.jamendo_id}
              className="mb-4 p-4 border rounded-md shadow-md break-words"
            >
              <h4 className="text-lg font-semibold">{song.name}</h4>
              <p className="">By {song.artist}</p>
              <p className="text-gray-500">
                Status: {song.status.replace(/_/g, " ").toUpperCase()}
              </p>
              <Link
                to={`/songs/${song.id}`}
                className="hover:underline drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]"
              >
                View Song
              </Link>
            </div>
          ))
        ) : (
          <p>No recent songs found.</p>
        )}
      </div>
    </FadePageWrapper>
  );
};

export default RecentSongsList;
