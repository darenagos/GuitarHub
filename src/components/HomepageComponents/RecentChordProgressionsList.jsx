import React from "react";
import { Link } from "react-router";
import FadePageWrapper from "../HOC/FadePageWrapper";
import myCreationsIcon from "../../assets/icons/music-note-icon.png";

const RecentChordProgressionsList = ({ chordProgressions }) => {
  return (
    <FadePageWrapper>
      <div className="bg-white rounded-md shadow-md h-full">
        <div className="flex items-center border-b-2 border-gray-100 p-3 justify-between">
          <h3 className="text-xl font-semibold ">My Recent Creations</h3>
          <img src={myCreationsIcon} className="h-8 w-auto" />
        </div>
        <div className="p-4">
          {chordProgressions.length > 0 ? (
            chordProgressions.map((progression, index) => (
              <div
                key={progression.id}
                className="mb-4 p-4 break-words border-2 border-gray-100 rounded-lg"
              >
                <h4 className="text-lg font-semibold ">
                  {progression.song_name}
                </h4>
                <p className="text-sm text-gray-500 mt-2 mb-2">
                  Created At:{" "}
                  {new Date(progression.created_at).toLocaleString()}
                </p>

                <Link
                  to={`/user-songs/${progression.id}`}
                  className="flex justify-center rounded-lg shadow p-2 hover:scale-105 transition ease-in-out drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]"
                >
                  View Chord Progression
                </Link>
              </div>
            ))
          ) : (
            <p>No recent chord progressions found.</p>
          )}
        </div>
      </div>
    </FadePageWrapper>
  );
};

export default RecentChordProgressionsList;
