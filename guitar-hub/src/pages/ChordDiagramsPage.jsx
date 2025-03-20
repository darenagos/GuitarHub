import React from "react";
import NavBar from "../components/Navbar";
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
    <>
      <NavBar />
      <ChordDiagramSearchBar onSearch={handleSearch} />
      {searchResults ? (
        <ChordDiagram chordData={searchResults[0]} />
      ) : (
        <p>No chords found matching your search criteria.</p>
      )}

      <ChordDatabase />
    </>
  );
};

export default ChordDiagramsPage;
