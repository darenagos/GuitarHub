import React from "react";
import { Link } from "react-router";
import FadePageWrapper from "../HOC/FadePageWrapper";

const RecentSongsList = ({ songs, loading, error }) => {
  return (
    <FadePageWrapper>
      <div className="p-6 border rounded-md shadow-md h-full">
        <h3 className="text-xl font-semibold mb-4">Top 3 Most Recent Songs</h3>

        {error ? (
          <p>Error fetching songs: {error.message}</p>
        ) : songs.length > 0 ? (
          songs.slice(0, 3).map((song) => (
            <div
              key={song.jamendo_id}
              className="mb-4 p-4 border rounded-md shadow-md break-words"
            >
              <h4 className="text-lg font-semibold">{song.name}</h4>
              <p>By {song.artist}</p>
              <p>Status: {song.status}</p>
              <Link to={`/songs/${song.id}`} className="hover:underline">
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
