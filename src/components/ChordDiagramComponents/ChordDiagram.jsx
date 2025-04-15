import React from "react";
import Chord from "@tombatossals/react-chords/lib/Chord";

const instrument = {
  name: "Guitar",
  tunings: {
    standard: ["E", "A", "D", "G", "B", "E"],
  },
  strings: 6,
  fretsOnChord: 4,
};

const ChordDiagram = ({ chordData }) => {
  if (!chordData || !chordData.positions || chordData.positions.length === 0) {
    return <p>Chord not found </p>;
  }

  return (
    <div>
      <h2>
        {chordData.key} {chordData.suffix}
      </h2>
      <div className="w-xs">
        <Chord
          chord={chordData.positions[0]} // Use the first variation
          instrument={instrument}
          lite={false}
        />
      </div>
    </div>
  );
};

export default ChordDiagram;
