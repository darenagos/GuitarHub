import React from "react";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import ChordDiagramSearchBar from "../components/ChordDiagramComponents/ChordDiagramSearchBar";
import ChordDatabase from "../components/ChordDiagramComponents/ChordDatabase";
import ChordDiagram from "../components/ChordDiagramComponents/ChordDiagram";
import { useState } from "react";

import { findChord } from "../utils/chordUtils";

const ChordDiagramsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchCleared, setIsSearchCleared] = useState(false);
  const [hasPressedSubmit, setHasPressedSubmit] = useState(false);

  const handleSearch = (chordName, suffix) => {
    if (!chordName) {
      setSearchResults([]);
      setIsSearchCleared(true);
      setHasPressedSubmit(false);
      console.log("Search cleared, hiding 'No chords found' message.");
      return;
    }

    setHasPressedSubmit(true);
    setIsSearchCleared(false); // Reset cleared flag when searching
    const result = findChord(chordName, suffix) || [];
    console.log("Chord search result:", result);
    setSearchResults(result.length > 0 ? result : []);
  };

  return (
    <FadePageWrapper>
      <div className=" flex flex-col scrollable-content mt-[10vh] h-[90vh] pt-10 ">
        <div className="mx-auto px-6">
          <ChordDiagramSearchBar onSearch={handleSearch} />
        </div>
        {/* Search Results */}
        {isSearchCleared ? (
          null && hasPressedSubmit == false
        ) : searchResults.length > 0 ? (
          <div className="max-w-4xl mx-auto mb-8 px-6 ">
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <ChordDiagram chordData={searchResults[0]} />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto mb-8 px-6 text-center">
            <p className="text-lg text-gray-600">
              No chords found matching your search criteria.
            </p>
          </div>
        )}

        <ChordDatabase />
      </div>
    </FadePageWrapper>
  );
};

export default ChordDiagramsPage;
