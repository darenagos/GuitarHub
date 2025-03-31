import React, { useState, useEffect } from "react";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import { supabase } from "../supabaseClient";

import { UserAuth } from "../context/AuthContext"; // Import UserAuth
import AddCustomSongForm from "../components/MySongsComponents/AddCustomSongForm";
import UserCustomSongList from "../components/MySongsComponents/UserCustomSongList";

const MySongsPage = () => {
  const { session } = UserAuth(); // Get session from AuthContext
  const userId = session?.user?.id; // Get user ID

  const [userSongs, setUserSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchUserSongs(); // Fetch once on load
  }, [userId]);

  const fetchUserSongs = async () => {
    if (!userId) {
      console.log("User ID is not available");
      return;
    }

    const { data, error } = await supabase
      .from("usersChordProgressions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }); // Fetch only songs belonging to the logged-in user

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
        <div className="h-screen flex flex-col">
          {/* Form for adding custom songs */}
          <AddCustomSongForm userId={userId} fetchUserSongs={fetchUserSongs} />

          {/* Display list of user-created songs */}
          <div className="song-list-container">
            {!loading ? (
              <UserCustomSongList userSongs={userSongs} />
            ) : (
              <p className="text-center text-gray-600">Loading songs...</p>
            )}
          </div>
        </div>
      </FadePageWrapper>
    </div>
  );
};

export default MySongsPage;
