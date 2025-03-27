import React from "react";
import ChordDiagram from "../ChordDiagramComponents/ChordDiagram";
import MissingChords from "./MissingChords";

const UserCustomChordSequence = ({ song, chordDiagrams }) => {
  return (
    <div className="mt-6 flex flex-wrap justify-center max-w-6xl mx-auto">
      <p>Chord Sequence:</p>
      <div className="mt-6">
        {song.chord_sequence ? (
          <div>
            <p>{song.chord_sequence}</p>
            <div className="flex flex-wrap justify-center space-x-4 gap-4 mt-6">
              {chordDiagrams.length > 0 ? (
                chordDiagrams.map((diagram, index) =>
                  diagram ? (
                    <div className="bg-white p-2 justify-center" key={index}>
                      <ChordDiagram chordData={diagram} />
                    </div>
                  ) : null
                )
              ) : (
                <p>No diagrams available</p>
              )}
            </div>
            <MissingChords song={song} chordDiagrams={chordDiagrams} />
          </div>
        ) : (
          <p>No chord sequence found for this song.</p>
        )}
      </div>
    </div>
  );
};

export default UserCustomChordSequence;
