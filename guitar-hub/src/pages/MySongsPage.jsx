import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

import { UserAuth } from "../context/AuthContext"; // Import UserAuth
import AddCustomSongForm from "../components/MySongsComponents/AddCustomSongForm";
import UserCustomSongList from "../components/MySongsComponents/UserCustomSongList";
import SongSearchSection from "../components/MySongsComponents/SongSearchSection";

const MySongsPage = () => {
  const { session } = UserAuth(); // Get session from AuthContext
  const userId = session?.user?.id; // Get user ID
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [chords, setChords] = useState([]);
  const [userSongs, setUserSongs] = useState([]);

  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    console.log("User ID:", userId); // Log userId to confirm it
    if (userId) fetchUserSongs();
  }, [userId]);

  const fetchUserSongs = async () => {
    if (!userId) {
      console.log("User ID is not available");
      return;
    }

    const { data, error } = await supabase
      .from("usersChordProgressions")
      .select("*")
      .eq("user_id", userId); // Fetch only songs belonging to the logged-in user

    if (error) {
      console.error("Error fetching user songs:", error);
    } else {
      console.log("Fetched user songs:", data); // Log fetched data
      setUserSongs(data); // Set the user songs state
    }

    setLoading(false); // Set loading to false after the data is fetched
  };

  // Set a fixed height for the song list container
  return (
    <>
      {/* Form for adding custom songs */}
      <AddCustomSongForm userId={userId} fetchUserSongs={fetchUserSongs} />

      {/* Display list of user-created songs */}
      <div className="song-list-container" style={{ minHeight: "300px" }}>
        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <span></span>
          </div>
        ) : (
          <UserCustomSongList userSongs={userSongs} />
        )}
      </div>

      {/* Search for a song section */}
      <SongSearchSection
        selectedSongId={selectedSongId}
        setSelectedSongId={setSelectedSongId}
        setChords={setChords}
        chords={chords}
      />
    </>
  );
};

export default MySongsPage;
