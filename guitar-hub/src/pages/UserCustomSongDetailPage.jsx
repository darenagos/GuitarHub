import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { findChordsFromJSON } from "../utils/chordUtils";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import UserCustomSongHeader from "../components/MySongsComponents/UserCustomSongHeader";
import UserCustomChordSequence from "../components/MySongsComponents/UserCustomChordSequence";
import UserCustomSongEditForm from "../components/MySongsComponents/UserCustomSongEditForm";
import {
  fetchUserSongById,
  updateCustomSong,
  deleteCustomSong,
} from "../services/songService";

import { UserAuth } from "../context/AuthContext"; // Import UserAuth

const UserCustomSongDetailPage = () => {
  const { id } = useParams();
  const { userId } = UserAuth();
  const { session } = UserAuth(); // Assuming 'session' is part of the context

  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chordDiagrams, setChordDiagrams] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSongName, setEditedSongName] = useState("");
  const [editedChordSequence, setEditedChordSequence] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const { data, error } = await fetchUserSongById(session?.user.id, id); // Ensure userId is passed
        if (error) throw error;

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
      } catch (error) {
        console.error("Error fetching song:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [id, userId]); // Ensure to include userId as a dependency if needed

  useEffect(() => {
    if (!song || !song.chord_sequence) return;

    try {
      const chords = JSON.parse(song.chord_sequence);
      if (Array.isArray(chords)) {
        const diagrams = findChordsFromJSON(chords);
        setChordDiagrams(diagrams);
      } else {
        console.error("chord_sequence is not an array:", chords);
      }
    } catch (error) {
      console.error("Error parsing chord sequence:", error);
    }
  }, [song]);

  const handleDeleteSong = async () => {
    const { error } = await deleteCustomSong(id);
    if (error) {
      console.error("Error deleting song:", error);
      alert("Failed to delete song");
    } else {
      alert("Song deleted successfully.");
      navigate("/my-songs");
    }
  };

  const handleUpdateSong = async (e) => {
    e.preventDefault();

    const formattedChords = JSON.stringify(
      editedChordSequence.split(",").map((chord) => chord.trim())
    );

    const { error } = await updateCustomSong(
      id,
      editedSongName,
      formattedChords
    );
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

  if (loading) {
    return (
      <div
        data-testid="loading"
        className="flex justify-center items-center min-h-screen"
      ></div>
    );
  }

  if (!song) {
    return (
      <div className="text-center">
        <h2>Song not found</h2>
        <Link to="/my-songs">Back to Songs</Link>
      </div>
    );
  }

  return (
    <FadePageWrapper>
      <div className="flex flex-col items-center mb-6 max-w-screen mt-[10vh] h-[90vh] scrollable-content pb-10">
        <div className="max-w-4xl mx-auto w-full self-start pt-6">
          <Link
            to="/my-songs"
            className="hover:text-gray-700 transition-all ease-in-out text-gray-500"
          >
            &lt; Back to songs
          </Link>
        </div>
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg opacity-100 transition-opacity duration-1500 ease-in-out mt-10">
          <UserCustomSongHeader
            songName={song.song_name}
            onDelete={handleDeleteSong}
          />
        </div>
        <div>
          <button
            onClick={handleEditClick}
            className="mt-6 text-xl hover:scale-105 transition duration-300"
          >
            Edit Song
          </button>
        </div>
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
    </FadePageWrapper>
  );
};

export default UserCustomSongDetailPage;
