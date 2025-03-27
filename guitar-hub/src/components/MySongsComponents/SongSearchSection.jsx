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
    <div className="flex justify-start items-center p-6 w-full max-w-4xl  mx-auto">
      <div className="w-full">
        <h3 className="text-2xl mb-4">Search for a song:</h3>
        <SongSearch
          onSongSelect={(id) => {
            setSelectedSongId(id);
            fetchChords(id);
          }}
        />
        {selectedSongId && <ChordSequenceDisplay chords={chords} />}
        <div className="mb-6">
          <h2 className="text-2xl mb-4 mt-6">Chord Timeline:</h2>
          <p>~</p>
          <ChordTimeline chords={chords} />
        </div>
      </div>
    </div>
  );
};

export default SongSearchSection;
