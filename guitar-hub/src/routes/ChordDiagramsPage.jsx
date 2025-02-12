import React from "react";
import NavBar from "../components/Navbar";
import Heading from "../components/Heading";
import ChordDiagramSearchBar from "../components/ChordDiagramSearchBar";
import ChordDiagramGrid from "../components/ChordDiagramGrid";
import ChordDatabase from "../components/ChordDatabase";
import ChordDiagram from "../components/ChordDiagram";
import { useState } from "react";
import chordDB from "@tombatossals/chords-db/lib/guitar.json";

const ChordDiagramsPage = () => {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = (chordName, suffix) => {
    const result = findChord(chordName, suffix);
    setSearchResults(result);
  };

  const findChord = (chordName, suffix) => {
    // Clean inputs
    const formattedChordName = chordName
      .trim()
      .replace(/♯/g, "#")
      .replace(/#/g, "sharp");

    const formattedSuffix = suffix.trim().toLowerCase();

    // Dynamically search for the chord and its suffixes
    const chord = chordDB.chords[formattedChordName];

    console.log("Formatted chord: ", formattedChordName);
    console.log("Available keys: ", Object.keys(chordDB.chords));

    // Check if the chord exists in the database
    if (!chordDB.chords.hasOwnProperty(formattedChordName)) {
      console.log(`Chord not found: ${formattedChordName}`);
      console.log("Available keys: ", Object.keys(chordDB.chords));
      return null; // Chord doesn't exist
    }

    // Filter positions by suffix
    const filteredChords = chord.filter((entry) => {
      return entry.suffix.toLowerCase().includes(formattedSuffix);
    });

    return filteredChords.length > 0 ? filteredChords : null;
  };

  return (
    <div>
      <ChordDiagramSearchBar onSearch={handleSearch} />
      {searchResults ? (
        <ChordDiagram chordData={searchResults[0]} />
      ) : (
        <p>No chords found matching your search criteria.</p>
      )}

      <ChordDatabase />
    </div>
  );
};

export default ChordDiagramsPage;
