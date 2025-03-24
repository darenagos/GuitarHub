import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ChordDiagram from "../components/ChordDiagramComponents/ChordDiagram";
import Navbar from "../components/Navbar";
import { findChordsFromJSON } from "../utils/chordUtils"; // Import new function

import UserCustomSongHeader from "../components/MySongsComponents/UserCustomSongHeader";
import UserCustomChordSequence from "../components/MySongsComponents/UserCustomChordSequence";

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
      <UserCustomSongHeader
        songName={song.song_name}
        onDelete={handleDeleteSong}
      />
      <UserCustomChordSequence song={song} chordDiagrams={chordDiagrams} />
    </div>
  );
};

export default UserCustomSongDetailPage;
