import { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext"; // Import UserAuth

import SongForm from "../components/LearningComponents/SongForm";
import SongList from "../components/LearningComponents/SongList";

// custom hook to handle fetching logic
import useFetchSongs from "../hooks/useFetchSongs"; // import the new custom hook

const API_KEY = "05955013";

const LearningPage = () => {
  const [wantToLearnList, setWantToLearnList] = useState([]);
  const [songToLearn, setSongToLearn] = useState("");
  const [artistOfSongToLearn, setArtistOfSongToLearn] = useState("");
  const [status, setStatus] = useState("want_to_learn");
  const { session } = UserAuth(); // Get session from AuthContext

  console.log("Session:", session);
  console.log("User ID:", session?.user?.id);

  const { songs, loading, error, fetchSongs } = useFetchSongs(
    session?.user?.id
  );
  console.log("Fetched songs:", songs);

  const addSongToWantToLearn = async () => {
    const userId = session.user.id; // Access the user ID from session

    console.log("User ID:", userId);

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

      // fetch chords sequence from Johans API

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
        user_id: userId, // Pass the user ID here
      };
      const { data, error } = await supabase
        .from("songs")
        .insert([newSongToLearn])
        .single();

      if (error) {
        console.log("error adding song: ", error);
      } else {
        // Clear form
        setSongToLearn("");
        setArtistOfSongToLearn("");

        // Refetch songs after successfully adding one
        fetchSongs();
      }
    } catch (error) {
      console.error("Error in addSongToWantToLearn:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
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
      <SongList wantToLearnList={songs} />
    </div>
  );
};

export default LearningPage;
