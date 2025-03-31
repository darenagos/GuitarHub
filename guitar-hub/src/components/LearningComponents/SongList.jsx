import { useState } from "react";
import SongItem from "./SongItem";
import FadePageWrapper from "../HOC/FadePageWrapper";

const SongList = ({ wantToLearnList }) => {
  const [sortOrder, setSortOrder] = useState({
    want_to_learn: "desc",
    currently_learning: "desc",
    learnt: "desc",
  });

  const groupedSongs = {
    want_to_learn: [],
    currently_learning: [],
    learnt: [],
  };

  wantToLearnList.forEach((song) => {
    if (groupedSongs[song.status]) {
      groupedSongs[song.status].push(song);
    }
  });

  const handleSortClick = (status) => {
    setSortOrder((prev) => ({
      ...prev,
      [status]: prev[status] === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <FadePageWrapper>
      <div className="px-10 py-5">
        <div className="mx-auto grid grid-cols-3 gap-8 py-10">
          {Object.entries(groupedSongs).map(([status, songs]) => {
            // Sort each category's songs separately
            const sortedSongs = [...songs].sort((a, b) => {
              return sortOrder[status] === "desc"
                ? new Date(b.created_at) - new Date(a.created_at) // Newest first
                : new Date(a.created_at) - new Date(b.created_at); // Oldest first
            });
            return (
              <div className="flex flex-col items-center" key={status}>
                <h3 className="text-3xl text-center py-3 text-gray-800 flex items-center gap-2 ">
                  {status.replace("_", " ").toUpperCase()}
                  <button
                    className="ml-3 text-sm cursor-pointer  hover:scale-130 ease-in-out rounded transition flex items-center"
                    onClick={() => handleSortClick(status)}
                  >
                    <span
                      className={`transform transition-transform duration-300 ${
                        sortOrder[status] === "desc" ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                </h3>

                {sortedSongs.length > 0 ? (
                  <div className="px-5">
                    <ul className="space-y-4">
                      {sortedSongs.map((song) => (
                        <SongItem key={song.id} song={song} />
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-center text-gray-600">
                    No songs in this category.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </FadePageWrapper>
  );
};

export default SongList;
