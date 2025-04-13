import React, { useState } from "react";

const ChordSequenceDisplay = ({ chords }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="w-full mx-auto p-4 ">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="px-4 py-2 bg-white font-semibold rounded-md shadow-md hover:bg-beige focus:outline-none hover:scale-105 transition cursor-pointer"
      >
        {isVisible ? "Hide Chord Sequence <" : "Show Chord Sequence >"}
      </button>

      {isVisible && (
        <div className="mt-4 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Chord Sequence
          </h2>
          {chords && chords.length > 0 ? (
            <ul className="divide-y divide-gray-300">
              {chords.map((chord, index) => (
                <li
                  key={index}
                  className="p-2 flex justify-between items-center bg-gray-50 hover:bg-white rounded-md"
                >
                  <span className="font-medium text-gray-700">
                    {chord.label}
                  </span>
                  <span className="text-sm text-gray-500">
                    {chord.start.toFixed(1)}s - {chord.end.toFixed(1)}s
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Loading chords...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChordSequenceDisplay;
