import React from "react";

const ChordSequenceDisplay = ({ chords }) => {
  return (
    <div>
      <h2>Chord Sequence</h2>
      {chords ? (
        <ul>
          {chords.map((chord, index) => (
            <li key={index}>
              {chord.label} (Start: {chord.start}s, End: {chord.end}s)
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading chords...</p>
      )}
    </div>
  );
};

export default ChordSequenceDisplay;
