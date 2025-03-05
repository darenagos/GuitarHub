import React from "react";
import { useState } from "react";
import NavBar from "../components/Navbar";
import SongSearch from "../components/MySongsComponents/SongSearch";
import ChordSequenceDisplay from "../components/MySongsComponents/ChordSequenceDisplay";
import ChordTimeline from "../components/MySongsComponents/ChordTimeline";

const MySongsPage = () => {
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [chords, setChords] = useState([]);

  const fetchChords = async (songId) => {
    const url = `http://audio-analysis.eecs.qmul.ac.uk/function/analysis/audiocommons/jamendo-tracks:${songId}?descriptors=chords`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setChords(data.chords.chordSequence);
    } catch (error) {
      console.error("Error fetching chords:", error);
      setChords(null);
    }
  };

  return (
    <div>
      <h1>My Songs</h1>
      <SongSearch
        onSongSelect={(id) => {
          setSelectedSongId(id);
          fetchChords(id);
        }}
      />
      {selectedSongId && <ChordSequenceDisplay chords={chords} />}
      <div>
        <h2>Chord Timeline</h2>
        <ChordTimeline chords={chords} />
      </div>
    </div>
  );
};
export default MySongsPage;
