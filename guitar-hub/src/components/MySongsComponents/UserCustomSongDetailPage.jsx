import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ChordDiagram from "../ChordDiagramComponents/ChordDiagram";
import Navbar from "../Navbar";
import { findChordsFromJSON } from "../../utils/chordUtils"; // Import new function

const UserCustomSongDetailPage = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chordDiagrams, setChordDiagrams] = useState([]);

  const navigate = useNavigate();

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

    console.log("Chord Sequenceeeeeeeeeeee:", song?.chord_sequence);
  }, [id]);

  useEffect(() => {
    if (!song || !song.chord_sequence) {
      console.warn("song.chord_sequence is missing or undefined:", song);
      return;
    }

    try {
      const chords = JSON.parse(song.chord_sequence);
      console.log("Parsed Chord Sequence:", chords);

      if (!Array.isArray(chords)) {
        console.error("chord_sequence is not an array:", chords);
        return;
      }

      // Use findChordsFromJSON to process all chords at once

      const diagrams = findChordsFromJSON(chords);
      setChordDiagrams(diagrams);
    } catch (error) {
      console.error("Error parsing chord sequence:", error);
    }
  }, [song?.chord_sequence]);

  const handleDeleteSong = async () => {
    const { error } = await supabase
      .from("usersChordProgressions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting song:", error);
      alert("Failed to delete song");
    } else {
      alert("Song deleted succesfully.");
      navigate("/my-songs");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!song) return <p>Song not found</p>;

  console.log("Song Data:", song);
  console.log("Chord Sequence:", song?.chord_sequence);
  console.log("Chord Diagrams before rendering:", chordDiagrams);

  return (
    <div>
      <Navbar />
      <h1>{song.song_name}</h1>
      <button onClick={handleDeleteSong}>Delete Song</button>
      <p>Chord Sequence:</p>
      <div>
        {song.chord_sequence ? (
          <div>
            <p>{song.chord_sequence}</p>
            <div className="flex flex-wrap justify-center space-x-4 gap-4 ">
              {chordDiagrams.length > 0 ? (
                chordDiagrams.map((diagram, index) =>
                  diagram ? (
                    <div className="border p-2 justify-center" key={index}>
                      <ChordDiagram chordData={diagram} />
                    </div>
                  ) : (
                    <div>
                      {chordDiagrams.some((diagram) => diagram === null) && (
                        <div>
                          <p>Chords not found:</p>
                          <ul>
                            {song.chord_sequence
                              .split(",") // Assuming it's a comma-separated string
                              .map((chord, index) => {
                                // Check if this chord didn't have a corresponding diagram
                                if (!chordDiagrams[index]) {
                                  return <li key={index}>{chord}</li>;
                                }
                                return null;
                              })}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                )
              ) : (
                <p>No diagrams available</p>
              )}
            </div>

            {/* List the missing chords */}
          </div>
        ) : (
          <p>No chord sequence found for this song.</p>
        )}
      </div>
    </div>
  );
};

export default UserCustomSongDetailPage;
