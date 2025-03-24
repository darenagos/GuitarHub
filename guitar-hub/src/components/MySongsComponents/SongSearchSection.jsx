import React from "react";
import SongSearch from "./SongSearchComponents/SongSearch";
import ChordSequenceDisplay from "../ChordSequenceComponents/ChordSequenceDisplay";
import ChordTimeline from "../ChordSequenceComponents/ChordTimeline";

const SongSearchSection = ({
  selectedSongId,
  setSelectedSongId,
  setChords,
  chords,
}) => {
  const fetchChords = async (songId) => {
    const url = `http://audio-analysis.eecs.qmul.ac.uk/function/analysis/audiocommons/jamendo-tracks:${songId}?descriptors=chords`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setChords(data.chords.chordSequence);
    } catch (error) {
      console.error("Error fetchings chords:", error);
      setChords(null);
    }
  };
  return (
    <div>
      <h3>Search for a song:</h3>
      <SongSearch
        onSongSelect={(id) => {
          setSelectedSongId(id);
          fetchChords(id);
        }}
      />
      {selectedSongId && <ChordSequenceDisplay chords={chords} />}
      <div>
        <h2>Chord Timeline:</h2>
        <ChordTimeline chords={chords} />
      </div>
    </div>
  );
};

export default SongSearchSection;
