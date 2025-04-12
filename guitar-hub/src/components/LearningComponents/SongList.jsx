import { useState } from "react";
import SongItem from "./SongItem";
import FadePageWrapper from "../HOC/FadePageWrapper";

import searchIcon from "../../assets/search-interface-symbol.png";

const SongList = ({ wantToLearnList }) => {
  const [sortOrder, setSortOrder] = useState({
    want_to_learn: "desc",
    learning: "desc",
    mastered: "desc",
  });

  const [searchTerms, setSearchTerms] = useState({
    want_to_learn: "",
    learning: "",
    mastered: "",
  });

  const groupedSongs = {
    want_to_learn: [],
    learning: [],
    mastered: [],
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

  const handleSearchChange = (status, value) => {
    setSearchTerms((prev) => ({
      ...prev,
      [status]: value,
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

            const filteredSongs =
              searchTerms[status].trim() === ""
                ? sortedSongs
                : sortedSongs.filter((song) =>
                    song.name
                      ?.toLowerCase()
                      .includes(searchTerms[status].toLowerCase())
                  );

            return (
              <div className="flex flex-col items-center" key={status}>
                <h3 className="text-3xl text-center py-3 text-gray-800 flex items-center gap-2 h-20">
                  {status.replace(/_/g, " ").toUpperCase()}
                  <button
                    className="ml-3 text-sm cursor-pointer  hover:scale-110 ease-in-out rounded transition flex items-center"
                    onClick={() => handleSortClick(status)}
                  >
                    {" "}
                    Date added
                    <span
                      className={`transform transition-transform duration-300 ${
                        sortOrder[status] === "desc" ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                </h3>

                {/* Search Bar for Each Category */}
                <input
                  type="text"
                  placeholder="Search..."
                  style={{
                    backgroundImage: `url(${searchIcon})`,
                    backgroundPosition: "left 10px center",
                    backgroundSize: "16px",
                    backgroundRepeat: "no-repeat",
                    paddingLeft: "35px", // Make space for the icon
                  }}
                  value={searchTerms[status]}
                  onChange={(e) => handleSearchChange(status, e.target.value)}
                  className="p-2 mb-4 border border-gray-300 rounded w-full "
                />

                {/* Always show full list when search is empty */}
                {filteredSongs.length > 0 ? (
                  <div className="px-5">
                    <ul className="space-y-4">
                      {filteredSongs.map((song) => (
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
