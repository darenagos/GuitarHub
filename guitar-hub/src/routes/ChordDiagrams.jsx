import React from "react";
import NavBar from "../components/Navbar";
import Heading from "../components/Heading";
import ChordDiagramSearchBar from "../components/ChordDiagramSearchBar";
import ChordDiagramGrid from "../components/ChordDiagramGrid";
import ChordDiagram from "../components/ChordDiagram";
import { useState } from "react";

const ChordDiagrams = () => {
  const [searchChord, setSearchChord] = useState("");

  const handleSearch = (event) => {
    setSearchChord(event.target.value.toUpperCase());
  };

  return (
    <>
      <Heading />
      <ChordDiagramSearchBar value={searchChord} onChange={handleSearch} />
      <ChordDiagram chordName={searchChord} />
      <p>inside chord diagrams</p>
    </>
  );
};

export default ChordDiagrams;
