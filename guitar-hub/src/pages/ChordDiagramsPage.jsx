import React from "react";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import ChordDiagramSearchBar from "../components/ChordDiagramComponents/ChordDiagramSearchBar";
import ChordDatabase from "../components/ChordDiagramComponents/ChordDatabase";
import ChordDiagram from "../components/ChordDiagramComponents/ChordDiagram";
import { useState } from "react";
import chordDB from "@tombatossals/chords-db/lib/guitar.json";

import { findChord } from "../utils/chordUtils";

const ChordDiagramsPage = () => {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = (chordName, suffix) => {
    const result = findChord(chordName, suffix);
    setSearchResults(result);
  };

  return (
    <FadePageWrapper>
      <div className=" flex flex-col">
        <div className="mx-auto mb-8 px-6">
          <ChordDiagramSearchBar onSearch={handleSearch} />
        </div>
        {/* Search Results */}
        {searchResults ? (
          <div className="max-w-4xl mx-auto mb-8 px-6">
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
