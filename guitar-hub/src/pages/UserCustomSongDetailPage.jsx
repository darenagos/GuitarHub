import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ChordDiagram from "../components/ChordDiagramComponents/ChordDiagram";
import Navbar from "../components/Navbar";
import { findChordsFromJSON } from "../utils/chordUtils"; // Import new function

import UserCustomSongHeader from "../components/MySongsComponents/UserCustomSongHeader";
import UserCustomChordSequence from "../components/MySongsComponents/UserCustomChordSequence";
import UserCustomSongEditForm from "../components/MySongsComponents/UserCustomSongEditForm";

const UserCustomSongDetailPage = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chordDiagrams, setChordDiagrams] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedSongName, setEditedSongName] = useState("");
  const [editedChordSequence, setEditedChordSequence] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSong = async () => {
      const { data, error } = await supabase
        .from("usersChordProgressions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching song:", error);
      else {
        setSong(data);
        setEditedSongName(data.song_name);

        try {
          const chordsArray = JSON.parse(data.chord_sequence);
          if (Array.isArray(chordsArray)) {
            setEditedChordSequence(chordsArray.join(", "));
          } else {
            console.error("Invalid chord sequence format");
          }
        } catch (err) {
          console.error("Error parsing chord sequence JSON:", err);
        }
      }
      setLoading(false);
    };
    fetchSong();
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

  const handleUpdateSong = async (e) => {
    e.preventDefault();

    // Convert user input into JSON format
    const formattedChords = JSON.stringify(
      editedChordSequence.split(",").map((chord) => chord.trim()) // ["A", "C", "Bm"]
    );

    const { error } = await supabase
      .from("usersChordProgressions")
      .update({
        song_name: editedSongName,
        chord_sequence: formattedChords, // Save as JSON string
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating song:", error);
      alert("Failed to update song.");
    } else {
      alert("Song updated successfully.");
      setSong((prev) => ({
        ...prev,
        song_name: editedSongName,
        chord_sequence: formattedChords,
      }));
      setIsEditing(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
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
      <button onClick={handleEditClick}>Edit Song</button>
      {isEditing && (
        <UserCustomSongEditForm
          editedSongName={editedSongName}
          setEditedSongName={setEditedSongName}
          editedChordSequence={editedChordSequence}
          setEditedChordSequence={setEditedChordSequence}
          handleUpdateSong={handleUpdateSong}
          setIsEditing={setIsEditing}
        />
      )}

      <UserCustomChordSequence song={song} chordDiagrams={chordDiagrams} />
    </div>
  );
};

export default UserCustomSongDetailPage;
