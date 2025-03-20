// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../supabaseClient";

// const UserCustomSongDetailPage = () => {
//   const { id } = useParams();
//   const [song, setSong] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSong = async () => {
//       const { data, error } = await supabase
//         .from("usersChordProgressions")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) console.error("Error fetching song:", error);
//       else setSong(data);
//       setLoading(false);
//     };

//     fetchSong();
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (!song) return <p>Song not found</p>;

//   return (
//     <div>
//       <h1>{song.song_name}</h1>
//       <p>Chord Sequence: {song.chord_sequence}</p>
//     </div>
//   );
// };

// export default UserCustomSongDetailPage;

//----------------------------------

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ChordDiagram from "../ChordDiagramComponents/ChordDiagram";
import Navbar from "../Navbar";
import { findChord } from "../../utils/chordUtils";

const UserCustomSongDetailPage = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chordDiagrams, setChordDiagrams] = useState([]);

  useEffect(() => {
    const fetchSong = async () => {
      const { data, error } = await supabase
        .from("usersChordProgressions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching song:", error);
      else setSong(data);
      setLoading(false);
    };

    fetchSong();
  }, [id]);

  useEffect(() => {
    if (!song || !song.chord_sequence) {
      console.warn("song.chord_sequence is missing or undefined:", song);
      return; // Stop execution if data is missing
    }

    try {
      const chords = JSON.parse(song.chord_sequence);
      console.log("Parsed Chord Sequence:", chords); // Debugging step

      if (!Array.isArray(chords)) {
        console.error("chord_sequence is not an array:", chords);
        return;
      }

      const diagrams = chords.map((chord, index) => {
        if (!chord || typeof chord !== "string") {
          console.warn(`Skipping invalid chord at index ${index}:`, chord);
          return null; // Prevent errors from undefined/null values
        }

        const chordDiagram = findChord(chord.trim());
        if (!chordDiagram) {
          console.warn(`No chord diagram found for: "${chord}"`);
        }
        return chordDiagram;
      });

      setChordDiagrams(diagrams);
    } catch (error) {
      console.error("Error parsing chord sequence:", error);
    }
  }, [song]);

  if (loading) return <p>Loading...</p>;
  if (!song) return <p>Song not found</p>;

  return (
    <div>
      <Navbar />
      <h1>{song.song_name}</h1>
      <p>Chord Sequence:</p>
      <div>
        {song.chord_sequence ? (
          <div>
            <p>{song.chord_sequence}</p>
            <div className="flex justify-center space-x-4">
              {chordDiagrams.length > 0 ? (
                chordDiagrams.map((diagram, index) =>
                  diagram ? (
                    <div className="border p-2 justify-center" key={index}>
                      <ChordDiagram chordData={diagram} />
                    </div>
                  ) : (
                    <p key={index}>
                      Chord diagram not found for: {song.chord_sequence[index]}
                    </p>
                  )
                )
              ) : (
                <p>No diagrams available</p>
              )}
            </div>
          </div>
        ) : (
          <p>No chord sequence found for this song.</p>
        )}
      </div>
    </div>
  );
};

export default UserCustomSongDetailPage;
