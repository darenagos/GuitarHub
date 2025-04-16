import React, { useState, useEffect } from "react";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import { UserAuth } from "../context/AuthContext";
import AddCustomSongForm from "../components/MySongsComponents/AddCustomSongForm";
import UserCustomSongList from "../components/MySongsComponents/UserCustomSongList";
import { fetchUserSongs } from "../services/songService";

/**
 * MySongsPage Component
 * Displays the user's custom songs, allows adding new songs, and fetches data from the backend.
 */

const MySongsPage = () => {
  const { session } = UserAuth(); // Get session from AuthContext
  const userId = session?.user?.id; // Get user ID

  const [userSongs, setUserSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetchUserSongs(userId).then(({ data, error }) => {
      if (error) {
        console.error("Error fetching user songs:", error);
      } else {
        setUserSongs(data);
      }
      setLoading(false);
    });
  }, [userId]);

  return (
    <div className="scrollable-content mt-[10vh] h-[90vh]">
      <FadePageWrapper>
        <div className="h-screen flex flex-col pt-10">
          <div>
            <h1 className="text-3xl font-semibold text-center mb-6">
              My Songs
            </h1>
          </div>
          {/* Form for adding custom songs */}
          <AddCustomSongForm
            userId={userId}
            fetchUserSongs={() =>
              fetchUserSongs(userId).then(({ data }) => setUserSongs(data))
            }
          />

          {/* Display list of user-created songs */}
          <div className="song-list-container">
            {!loading ? (
              <UserCustomSongList userSongs={userSongs} />
            ) : (
              <p className="text-center text-gray-600"></p>
            )}
          </div>
          <div className="pb-30"></div>
        </div>
      </FadePageWrapper>
    </div>
  );
};

export default MySongsPage;
