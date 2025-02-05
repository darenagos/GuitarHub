import React from "react";
import ReactDOM from "react-dom";

import Chord from "@tombatossals/react-chords/lib/Chord";

const ChordDiagram = ({ chord }) => {
  console.log("Chord dataaaa:", chord);
  console.log("Chord frets:", chord.positions);
  console.log("Chord fingers:", chord.fingerings);

  const defaultInstrument = {
    strings: 6,
    fretsOnChord: 4,
    name: "Guitar",
    keys: [],
    tunings: {
      standard: ["E", "A", "D", "G", "B", "E"],
    },
  };

  return (
    <div>
      <h3>{chord.name}</h3>
      <Chord
        chord={chord.positions}
        instrument={defaultInstrument}
        lite={false}
        height={200}
        width={200}
        finger={chord.fingerings}
      />
    </div>
  );
};

export default ChordDiagram;
