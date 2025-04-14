import React, { useState } from "react";
import chordDB from "@tombatossals/chords-db/lib/guitar.json";
import Chord from "@tombatossals/react-chords/lib/Chord";
import "../../assets/styles/ChordDatabase.css";

const instrument = {
  name: "Guitar",
  tunings: {
    standard: ["E", "A", "D", "G", "B", "E"],
  },
  strings: 6,
  fretsOnChord: 4,
};

const ChordDatabase = () => {
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedSuffix, setSelectedSuffix] = useState(null);

  const suffixes = Array.from(new Set(chordDB.suffixes));

  const handleKeyClick = (key) => {
    setSelectedKey(key);
    setSelectedSuffix(""); // Reset suffix selection when key changes
  };

  const handleSuffixClick = (suffix) => {
    setSelectedSuffix(suffix);
  };

  const getChordsForKey = () => {
    if (!selectedKey) return [];
    return chordDB.chords[selectedKey] || [];
  };

  const filteredChords = getChordsForKey().filter((chord) => {
    return (
      !selectedSuffix ||
      chord.suffix.toLowerCase() === selectedSuffix.toLowerCase()
    );
  });

  return (
    <div>
      <div className="pl-20 flex justify-start">
        <p className="text-gray-800">Select a Chord and a Suffix </p>
      </div>
      <div className="chord-database-page flex justify-center items-center">
        <div className="container">
          {/* Key Selection Tabs */}
          <div className="tabs rounded bg-white p-2 mb-4 flex justify-center items-center gap-10">
            {Object.keys(chordDB.chords).map((key) => (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={`py-2 px-4 text-lg font-medium  rounded-md transition-all duration-300 ease-in-out ${
                  selectedKey === key
                    ? "text-[#9cd0cd] "
                    : "bg-transparent text-gray-600 "
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Main content area */}
          <div className="main-content gap-6">
            {/* Suffix Filter Sidebar */}
            <div className="filter-sidebar mb-10 rounded">
              {suffixes.map((suffix) => (
                <button
                  key={suffix}
                  onClick={() => handleSuffixClick(suffix)}
                  className={`py-2 px-4 text-lg font-medium rounded-md transition-all duration-300 ease-in-out ${
                    selectedSuffix === suffix
                      ? "text-[#9cd0cd] transition-all duration-300 ease-in-out"
                      : "bg-transparent text-gray-600 "
                  }`}
                >
                  {suffix}
                </button>
              ))}
            </div>

            {/* Chords List and Diagrams (Scrollable) */}
            <div className="chords-list  overflow-y-auto px-4">
              {filteredChords.length === 0 ? (
                <p className="text-gray-400">No Chord selected</p>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {filteredChords.map((chord, index) => (
                    <div key={index}>
                      <h3 className="text-center">
                        {chord.key} {chord.suffix}
                      </h3>
                      <div className="chord flex justify-center items-center">
                        {/* Render Chord Diagram */}
                        <div className="w-2xs">
                          <Chord
                            chord={chord.positions[0]} // Render the first position of the chord
                            instrument={instrument}
                            lite={false}
                            className="chord-diagram"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChordDatabase;
