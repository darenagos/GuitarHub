import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
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

import editIcon from "../assets/icons/my-creations-icon.jpg";
import musicIcon from "../assets/icons/music-icon.png";

/**
 * UserCustomSongDetailPage Component
 * Displays detailed information for a custom user song, including name, chord sequence, and edit/delete functionality.
 * Allows the user to view, update, or delete their custom song. Includes chord diagram rendering and auto-clear success/error messages.
 */

const UserCustomSongDetailPage = () => {
  const { id } = useParams();
  const { userId, session } = UserAuth();

  // State variables to hold song data, loading state, chord diagrams, and edit state
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chordDiagrams, setChordDiagrams] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSongName, setEditedSongName] = useState("");
  const [editedChordSequence, setEditedChordSequence] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Fetch song details by id from the API when component mounts or user session changes
  useEffect(() => {
    const fetchSong = async () => {
      try {
        const { data, error } = await fetchUserSongById(session?.user.id, id);
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
        setErrorMessage("Failed to load song details.");
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [id, session?.user?.id]);

  // Update chord diagrams whenever the song data or chord sequence changes
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

  // Auto-clear messages
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleDeleteSong = async () => {
    const { error } = await deleteCustomSong(id);
    if (error) {
      console.error("Error deleting song:", error);
      setErrorMessage("Failed to delete song.");
    } else {
      setSuccessMessage("Song deleted successfully.");
      setTimeout(() => navigate("/my-songs"), 1000);
    }
  };

  const handleUpdateSong = async (e) => {
    e.preventDefault();

    const formattedChords = JSON.stringify(
      editedChordSequence.split(",").map((chord) => chord.trim())
    );

    // Call API to update the song details
    const { error } = await updateCustomSong(
      id,
      editedSongName,
      formattedChords
    );
    if (error) {
      console.error("Error updating song:", error);
      setErrorMessage("Failed to update song.");
    } else {
      setSuccessMessage("Song updated successfully.");
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
        <img src={musicIcon} className="h-20 w-auto" />
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg opacity-100 transition-opacity duration-1500 ease-in-out mt-10">
          <UserCustomSongHeader
            songName={song.song_name}
            onDelete={handleDeleteSong}
          />
        </div>

        {/* Display success or error messages */}
        <div className="flex justify-center mt-4">
          {errorMessage && (
            <p className="text-red-500 text-center mt-4 p-3 bg-red-50 rounded-md w-full max-w-lg">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="text-green-600 text-center mt-4 p-3 bg-green-50 rounded-md w-full max-w-lg">
              {successMessage}
            </p>
          )}
        </div>

        <div>
          <button
            onClick={handleEditClick}
            className="flex mt-6 text-xl hover:scale-105 transition duration-300 bg-white rounded p-2 shadow cursor-pointer"
          >
            Edit Song
            <img src={editIcon} alt="Edit" className="h-8 w-auto ml-1" />
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
