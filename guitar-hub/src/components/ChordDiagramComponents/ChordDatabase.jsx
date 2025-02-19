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
    setSelectedSuffix(null); // Reset suffix selection when key changes
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
    <div className="chord-database-page">
      <div className="container">
        {/* Key Selection Tabs */}
        <div className="tabs">
          {Object.keys(chordDB.chords).map((key) => (
            <button
              key={key}
              onClick={() => handleKeyClick(key)}
              className={selectedKey === key ? "active" : ""}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Main content area */}
        <div className="main-content">
          {/* Suffix Filter Sidebar */}
          <div className="filter-sidebar">
            {suffixes.map((suffix) => (
              <button
                key={suffix}
                onClick={() => handleSuffixClick(suffix)}
                className={selectedSuffix === suffix ? "active" : ""}
              >
                {suffix}
              </button>
            ))}
          </div>

          {/* Chords List and Diagrams */}
          <div className="chords-list">
            {filteredChords.length === 0 ? (
              <p>No chords found</p>
            ) : (
              filteredChords.map((chord, index) => (
                <div key={index} className="chord">
                  <h3>
                    {chord.key} {chord.suffix}
                  </h3>

                  {/* Render Chord Diagram */}
                  <Chord
                    chord={chord.positions[0]} // Render the first position of the chord
                    instrument={instrument}
                    lite={false}
                    className="chord-diagram"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChordDatabase;
