import React, { useState, useEffect } from "react";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
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
    if (!userId) return;

    fetchUserSongs(); // Fetch once on load

    const subscription = supabase
      .channel("user-songs-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "usersChordProgressions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Database change detected:", payload);
          fetchUserSongs(); // Re-fetch when database changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Cleanup subscription on unmount
    };
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

    setLoading(false); // Set loading to false after data fetch
  };

  return (
    <div className="scrollable-content mt-[10vh] h-[90vh]">
      <FadePageWrapper>
        <div className="h-screen flexflex-col">
          {/* Form for adding custom songs */}
          <AddCustomSongForm userId={userId} fetchUserSongs={fetchUserSongs} />

          {/* Display list of user-created songs */}
          <div className="song-list-container">
            {!loading && <UserCustomSongList userSongs={userSongs} />}
          </div>
        </div>
      </FadePageWrapper>
    </div>
  );
};

export default MySongsPage;
