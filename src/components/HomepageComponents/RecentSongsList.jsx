import React from "react";
import { Link } from "react-router";
import FadePageWrapper from "../HOC/FadePageWrapper";
import learningIcon from "../../assets/icons/learning-icon.jpg";

const RecentSongsList = ({ songs, loading, error }) => {
  return (
    <FadePageWrapper>
      <div className="bg-white rounded-md shadow-md h-full">
        <div className="flex items-center border-b-2 border-gray-100 p-3 justify-between">
          <h3 className="text-xl font-semibold ">Recent Songs</h3>
          <img src={learningIcon} className="ml-5 h-8 w-8" />
        </div>

        <div className="p-4">
          {error ? (
            <p>Error fetching songs: {error.message}</p>
          ) : songs.length > 0 ? (
            songs.slice(0, 3).map((song, index) => (
              <div
                key={song.jamendo_id}
                className="mb-4 p-4 break-words border-2 border-gray-100 rounded-lg"
              >
                <h4 className="text-lg font-semibold">{song.name}</h4>
                <p className="text-sm text-gray-500 mt-2 mb-2">
                  By {song.artist}
                </p>

                <div className="flex justify-between items-center">
                  <p
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-xl shadow-sm transition ${
                      song.status === "want_to_learn"
                        ? "text-[#A7C85F] hover:shadow-[0_0_10px_4px_rgba(197,217,122,0.8)]" // Green for "Want to Learn"
                        : song.status === "learning"
                        ? "text-[#1abc9c] hover:shadow-[0_0_10px_4px_rgba(118,215,196,0.8)]" // Blue for "Currently Learning"
                        : song.status === "mastered"
                        ? "text-yellow-500 hover:shadow-[0_0_10px_4px_rgba(255,220,2,0.6)]" // Yellow for "Learnt"
                        : "text-gray-500 hover:shadow-[0_0_10px_4px_rgba(156,163,175,0.8)]" // Default gray
                    }`}
                  >
                    {song.status.replace(/_/g, " ").toUpperCase()}
                  </p>

                  <Link
                    to={`/songs/${song.id}`}
                    className="rounded-lg shadow p-2 hover:scale-105 transition ease-in-out drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]"
                  >
                    View Song
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No recent songs found.</p>
          )}
        </div>
      </div>
    </FadePageWrapper>
  );
};

export default RecentSongsList;
