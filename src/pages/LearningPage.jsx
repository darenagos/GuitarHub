import { useState, useEffect } from "react";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import { UserAuth } from "../context/AuthContext"; // Import UserAuth

import SongForm from "../components/LearningComponents/SongForm";
import SongList from "../components/LearningComponents/SongList";

import { addSongToLearn } from "../services/songService";

// Custom hook to handle fetching logic
import useFetchSongs from "../hooks/useFetchSongs";
// import SongSearchSection from "../components/MySongsComponents/SongSearchSection";

const LearningPage = () => {
  // State for user inputs
  const [songToLearn, setSongToLearn] = useState("");
  const [artistOfSongToLearn, setArtistOfSongToLearn] = useState("");
  const [status, setStatus] = useState("want_to_learn");
  const { session } = UserAuth();

  // State for UI feedback
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");

  // Fetch user's saved songs
  const { songs, loading, error, fetchSongs } = useFetchSongs(
    session?.user?.id
  );

  // Auto-clear feedback messages after 4 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (loadingMessage) {
      const timer = setTimeout(() => setLoadingMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [loadingMessage]);

  const addSongToWantToLearn = async () => {
    if (!session?.user?.id) return;

    // Input validation
    if (!songToLearn.trim() || !artistOfSongToLearn.trim() || !status.trim()) {
      setFormError("Please fill out all the fields before adding a song.");
      return;
    }

    // Clear messages
    setFormError("");
    setSuccessMessage("");
    setErrorMessage("");
    setLoadingMessage("Adding song...");

    try {
      await addSongToLearn(
        songToLearn,
        artistOfSongToLearn,
        status,
        session.user.id
      );

      setLoadingMessage("");
      setSuccessMessage("Song added successfully!");
      fetchSongs();
      setSongToLearn("");
      setArtistOfSongToLearn("");
    } catch (error) {
      setLoadingMessage("");
      setFormError("Something went wrong while adding the song.");
    }
  };

  return (
    <FadePageWrapper>
      <div className="flex flex-col max-h-screen ">
        <div className="scrollable-content pt-10 mt-[10vh] h-[90vh]s">
          <h1 className="text-3xl font-semibold text-center mb-6">
            My Learning
          </h1>
          <SongForm
            addSongToWantToLearn={addSongToWantToLearn}
            songToLearn={songToLearn}
            setSongToLearn={setSongToLearn}
            artistOfSongToLearn={artistOfSongToLearn}
            setArtistOfSongToLearn={setArtistOfSongToLearn}
            status={status}
            setStatus={setStatus}
          />
          <div className="flex justify-center">
            {loadingMessage && (
              <p className="text-blue-500 text-center mt-4 p-3 bg-blue-50 rounded-md">
                {loadingMessage}
              </p>
            )}

            {formError && (
              <p className="text-red-500 text-center mt-4 p-3 bg-red-50 ">
                {formError}
              </p>
            )}

            {errorMessage && (
              <p className="text-red-500 text-center mt-4 p-3 bg-red-50 ">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="text-green-600 text-center mt-4 p-3 bg-green-50 rounded-md">
                {successMessage}
              </p>
            )}
          </div>

          <FadePageWrapper>
            {/* Display List of Songs */}
            <SongList wantToLearnList={songs} />
          </FadePageWrapper>

          {/* Search for a Song
        <SongSearchSection
          selectedSongId={selectedSongId}
          setSelectedSongId={setSelectedSongId}
          setChords={setChords}
          chords={chords}
        /> */}
        </div>
      </div>
    </FadePageWrapper>
  );
};

export default LearningPage;
