import React from "react";

const ChordDiagramGrid = ({ chords }) => {
  if (!Array.isArray(chords) || chords.length === 0) {
    console.warn("ChordDiagramGrid received invalid chords:", chords);
    return <p>No chords found</p>;
  }

  return <div></div>;
};

export default ChordDiagramGrid;
