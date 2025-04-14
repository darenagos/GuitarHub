import React from "react";
import ChordDiagram from "../ChordDiagramComponents/ChordDiagram";
import MissingChords from "./MissingChords";

const UserCustomChordSequence = ({ song, chordDiagrams }) => {
  // Split the chord sequence into an array
  const chordSequence = song.chord_sequence
    ? song.chord_sequence.split(",").map((chord) => chord.trim())
    : [];

  // Create a new array with only the chords that don't have a corresponding diagram
  const missingChords = chordSequence.filter(
    (chord, index) => !chordDiagrams[index]
  );

  console.log("missing chords: ", missingChords);
  return (
    <div className="mt-6">
      <p className="">Chord Sequence:</p>
      <div className="mt-6 flex flex-wrap justify-center max-w-6xl mx-auto">
        {song.chord_sequence ? (
          <div>
            <p className="pl-10 hover:text-orange-300 transition-all ease-in-out">
              {Array.isArray(song.chord_sequence)
                ? song.chord_sequence.join(" - ")
                : JSON.parse(song.chord_sequence).join(" - ")}
            </p>

            <div className="flex flex-wrap justify-center space-x-4 gap-4 mt-6">
              {chordDiagrams.length > 0 ? (
                chordDiagrams.map((diagram, index) =>
                  diagram ? (
                    <div
                      className="bg-white p-2 justify-center rounded"
                      key={index}
                    >
                      <ChordDiagram chordData={diagram} />
                    </div>
                  ) : null
                )
              ) : (
                <p>No diagrams available</p>
              )}
            </div>
            {/* <MissingChords song={song} missingChords={missingChords} /> */}
          </div>
        ) : (
          <p>No chord sequence found for this song.</p>
        )}
      </div>
    </div>
  );
};

export default UserCustomChordSequence;
