import chordDB from "@tombatossals/chords-db/lib/guitar.json";

export const findChord = (chordName, suffix) => {
  // Clean input for chord name and suffix
  const formattedChordName = chordName
    .trim()
    .replace(/♯/g, "#")
    .replace(/#/g, "sharp");

  const formattedSuffix = suffix.trim().toLowerCase();

  // Check if chord exists in the database
  if (!chordDB.chords.hasOwnProperty(formattedChordName)) {
    return null;
  }

  const chord = chordDB.chords[formattedChordName];

  // Filter positions by suffix
  const filteredChords = chord.filter((entry) =>
    entry.suffix.toLowerCase().includes(formattedSuffix)
  );

  return filteredChords.length > 0 ? filteredChords : null;
};
