import React from "react";
import { Link } from "react-router";
import FadePageWrapper from "../HOC/FadePageWrapper";

const RecentChordProgressionsList = ({ chordProgressions }) => {
  return (
    <FadePageWrapper>
      <div className="p-6 border rounded-md shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          Top 3 Most Recent Chord Progressions
        </h3>
        {chordProgressions.length > 0 ? (
          chordProgressions.map((progression) => (
            <div
              key={progression.id}
              className="mb-4 p-4 border rounded-md shadow-md break-words"
            >
              <h4 className="text-lg font-semibold ">
                Chord Progression for {progression.song_name}
              </h4>
              <p className="text-gray-500">
                Created At: {new Date(progression.created_at).toLocaleString()}
              </p>
              <Link
                to={`/user-songs/${progression.id}`}
                className="hover:underline"
              >
                View Chord Progression
              </Link>
            </div>
          ))
        ) : (
          <p>No recent chord progressions found.</p>
        )}
      </div>
    </FadePageWrapper>
  );
};

export default RecentChordProgressionsList;
