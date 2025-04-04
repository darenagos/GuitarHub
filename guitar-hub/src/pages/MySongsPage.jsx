import React, { useState, useEffect } from "react";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import { UserAuth } from "../context/AuthContext"; // Import UserAuth
import AddCustomSongForm from "../components/MySongsComponents/AddCustomSongForm";
import UserCustomSongList from "../components/MySongsComponents/UserCustomSongList";
import { fetchUserSongs } from "../services/songService"; // Import fetchUserSongs

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
        console.log("Fetched user songs:", data);
        setUserSongs(data);
      }
      setLoading(false);
    });
  }, [userId]);

  return (
    <div className="scrollable-content mt-[10vh] h-[90vh]">
      <FadePageWrapper>
        <div className="h-screen flex flex-col">
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
              <p className="text-center text-gray-600">Loading songs...</p>
            )}
          </div>
        </div>
      </FadePageWrapper>
    </div>
  );
};

export default MySongsPage;
