import React from "react";

const MissingChords = ({ song, chordDiagrams }) => {
  const missingChords = song.chord_sequence
    .split(",")
    .filter((_, index) => !chordDiagrams[index]);

  return missingChords.length > 0 ? (
    <div>
      <p>Chords not found:</p>
      <ul>
        {missingChords.map((chord, index) => (
          <li key={index}>{chord}</li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default MissingChords;
