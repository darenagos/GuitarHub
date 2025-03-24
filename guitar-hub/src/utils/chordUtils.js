import chordDB from "@tombatossals/chords-db/lib/guitar.json";

export const findChord = (chordName, suffix) => {
  // Clean input for chord name and suffix
  const formattedChordName = chordName
    .trim()
    .replace(/♯/g, "#")
    .replace(/#/g, "sharp")
    .toLowerCase()
    .replace(/^([a-z])/, (match) => match.toUpperCase()); // Capitalize first letter

  const formattedSuffix = suffix.trim().toLowerCase();

  // Check if chord exists in the database
  console.log(`Looking for chord: ${formattedChordName} ${formattedSuffix}`);
  if (!chordDB.chords.hasOwnProperty(formattedChordName)) {
    console.log(`Chord ${formattedChordName} not found in database`);
    return null;
  }

  const chord = chordDB.chords[formattedChordName];

  // Filter positions by suffix
  const filteredChords = chord.filter((entry) =>
    entry.suffix.toLowerCase().includes(formattedSuffix)
  );

  return filteredChords.length > 0
    ? filteredChords
    : { key: chordName, suffix, positions: [] };
};

export const findChordsFromJSON = (chordsArray) => {
  if (!Array.isArray(chordsArray)) {
    console.error("Input must be an array of chord names.");
    return null;
  }

  const uniqueChords = new Set();
  const chordDiagrams = [];

  chordsArray.forEach((chord) => {
    // Split chord by spaces, assuming the last word is the suffix
    const parts = chord.split(" ");
    const chordName = parts[0].toLowerCase(); // First part is always the chord name
    const suffix = parts.slice(1).join(" ") || "major"; // The rest is the suffix, default to "major" if no suffix

    // Log the chord name and suffix for debugging
    console.log(`Chord name: ${chordName}, Suffix: ${suffix}`);

    const chordDiagram = findChord(chordName, suffix);

    // If the chord diagram is not null and it's not already in the set, add it to the result
    if (chordDiagram && !uniqueChords.has(chordName + suffix)) {
      chordDiagrams.push({
        key: chordDiagram[0].key,
        suffix: chordDiagram[0].suffix,
        positions: chordDiagram[0].positions,
      });
      uniqueChords.add(chordName + suffix); // Track that this chord has been added
    }
  });

  return chordDiagrams.flat();
};
