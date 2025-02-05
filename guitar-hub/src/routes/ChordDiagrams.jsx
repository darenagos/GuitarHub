import React from "react";
import NavBar from "../components/Navbar";
import Heading from "../components/Heading";
import ChordDiagramSearchBar from "../components/ChordDiagramSearchBar";
import ChordDiagramGrid from "../components/ChordDiagramGrid";
import { useState } from "react";
import chordData from "../../chord-collection.json";

const ChordDiagrams = () => {
  const [searchItem, setSearchItem] = useState("");
  const [chords, setChord] = useState([]);

  const handleSearch = (event) => {};

  return (
    <>
      <Heading />
      <ChordDiagramSearchBar value={searchItem} onChange={handleSearch} />
      <ChordDiagramGrid chords={chords} />
      <p>inside chord diagrams</p>
    </>
  );
};

export default ChordDiagrams;
