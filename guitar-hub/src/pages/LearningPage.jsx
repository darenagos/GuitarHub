import { useState, useEffect } from "react";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext"; // Import UserAuth

import SongForm from "../components/LearningComponents/SongForm";
import SongList from "../components/LearningComponents/SongList";

// Custom hook to handle fetching logic
import useFetchSongs from "../hooks/useFetchSongs";
import SongSearchSection from "../components/MySongsComponents/SongSearchSection";

const API_KEY = "05955013";

const LearningPage = () => {
  const [songToLearn, setSongToLearn] = useState("");
  const [artistOfSongToLearn, setArtistOfSongToLearn] = useState("");
  const [status, setStatus] = useState("want_to_learn");
  const { session } = UserAuth(); // Get session from AuthContext

  const { songs, loading, error, fetchSongs } = useFetchSongs(
    session?.user?.id,
    console.log("here")
  );

  // Missing State Variables for Song Search
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [chords, setChords] = useState([]);

  const addSongToWantToLearn = async () => {
    if (!session?.user?.id) {
      console.error("User ID not found!");
      return;
    }

    const userId = session.user.id;

    console.log("Searching for song:", songToLearn, "by", artistOfSongToLearn);

    const searchUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${API_KEY}&format=json&limit=1&name=${encodeURIComponent(
      songToLearn
    )}&artist_name=${encodeURIComponent(artistOfSongToLearn)}`;

    try {
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData.results.length === 0) {
        console.log("No song found on Jamendo");
        return;
      }

      const songResult = searchData.results[0];
      const jamendoId = songResult.id;

      console.log("Found song: ", songResult.name, "Jamendo ID: ", jamendoId);

      // Fetch chord sequence from Johan's API
      const chordApiUrl = `http://audio-analysis.eecs.qmul.ac.uk/function/analysis/audiocommons/jamendo-tracks:${jamendoId}?descriptors=chords`;

      const chordResponse = await fetch(chordApiUrl);
      const chordData = await chordResponse.json();

      const chordSequence = chordData.chords.chordSequence;

      console.log("Chord Sequence:", chordSequence);

      const newSongToLearn = {
        name: songToLearn,
        artist: artistOfSongToLearn,
        jamendo_id: jamendoId,
        chord_sequence: chordSequence,
        status: status,
        user_id: userId,
      };

      const { data, error } = await supabase
        .from("songs")
        .insert([newSongToLearn])
        .single();

      if (error) {
        if (error.code === "23505") {
          // PostgreSQL unique constraint violation
          alert("This song is already in your list!");
          setSongToLearn(""); // Clear form inputs
          setArtistOfSongToLearn("");
        } else {
          alert(`Error adding song: ${error.message}`);
        }
      } else {
        alert("Song added successfully!");
      }

      if (error) {
        console.log("Error adding song: ", error);
      } else {
        fetchSongs(); // Refetch songs only if insertion was successful
        setSongToLearn(""); // Clear form inputs
        setArtistOfSongToLearn("");
      }
    } catch (error) {
      console.error("Error in addSongToWantToLearn:", error);
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
