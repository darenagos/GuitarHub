import React from "react";
import ReactDOM from "react-dom";

import Chord from "@tombatossals/react-chords/lib/Chord";
import chordDB from "@tombatossals/chords-db/lib/guitar.json";

console.log("Chord log:         " + Chord);
console.log("Chord db guitar.json log:          " + chordDB);

const instrument = {
  name: "Guitar",
  tunings: {
    standard: ["E", "A", "D", "G", "B", "E"],
  },
  strings: 6,
  fretsOnChord: 4,
};

const ChordDiagram = ({ chordData }) => {
  if (!chordData) {
    return <p>Chord not found {chordName}</p>;
  }

  console.log("Chord Data:", chordData);

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
