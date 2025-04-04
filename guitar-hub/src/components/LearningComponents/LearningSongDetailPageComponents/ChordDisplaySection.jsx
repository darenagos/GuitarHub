import React from "react";
import ChordSequenceDisplay from "../../ChordSequenceComponents/ChordSequenceDisplay";
import ChordTimeline from "../../ChordSequenceComponents/ChordTimeline";

const ChordDisplaySection = ({ chordSequence, currentSecond }) => (
  <div>
    {chordSequence?.length > 0 ? (
      <>
        <div className="mt-8">
          <ChordSequenceDisplay chords={chordSequence} />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mt-6">
          Chord Timeline
        </h2>
        <ChordTimeline chords={chordSequence} currentSecond={currentSecond} />
      </>
    ) : (
      <p className="mt-4 text-lg text-gray-600 text-center">
        No chord sequence available for this song.
      </p>
    )}
  </div>
);

export default ChordDisplaySection;
