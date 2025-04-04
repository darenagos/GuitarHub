import { useState, useEffect } from "react";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext"; // Import UserAuth

import SongForm from "../components/LearningComponents/SongForm";
import SongList from "../components/LearningComponents/SongList";

import { addSongToLearn } from "../services/songService";

// Custom hook to handle fetching logic
import useFetchSongs from "../hooks/useFetchSongs";
import SongSearchSection from "../components/MySongsComponents/SongSearchSection";

const API_KEY = "05955013";

const LearningPage = () => {
  const [songToLearn, setSongToLearn] = useState("");
  const [artistOfSongToLearn, setArtistOfSongToLearn] = useState("");
  const [status, setStatus] = useState("want_to_learn");
  const { session } = UserAuth();

  const { songs, loading, error, fetchSongs } = useFetchSongs(
    session?.user?.id
  );

  // Missing State Variables for Song Search
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [chords, setChords] = useState([]);

  const addSongToWantToLearn = async () => {
    if (!session?.user?.id) {
      console.error("User ID not found!");
      return;
    }

    try {
      const newSong = await addSongToLearn(
        songToLearn,
        artistOfSongToLearn,
        status,
        session.user.id
      );
      alert("Song added successfully!");
      fetchSongs(); // Refetch songs after successful insertion
      setSongToLearn("");
      setArtistOfSongToLearn("");
    } catch (error) {
      alert(`Error adding song: ${error.message}`);
    }
  };

  return (
    <FadePageWrapper>
      <div className="flex flex-col max-h-screen ">
        <div className="scrollable-content pt-10 mt-[10vh] h-[90vh]s">
          <h1 className="flex justify-center items-center">My Learning</h1>
          <SongForm
            addSongToWantToLearn={addSongToWantToLearn}
            songToLearn={songToLearn}
            setSongToLearn={setSongToLearn}
            artistOfSongToLearn={artistOfSongToLearn}
            setArtistOfSongToLearn={setArtistOfSongToLearn}
            status={status}
            setStatus={setStatus}
          />

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
