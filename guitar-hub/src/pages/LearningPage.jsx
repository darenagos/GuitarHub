import { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext"; // Import UserAuth

import SongForm from "../components/LearningComponents/SongForm";
import SongList from "../components/LearningComponents/SongList";

// custom hook to handle fetching logic
import useFetchSongs from "../hooks/useFetchSongs"; // import the new custom hook

const LearningPage = () => {
  const [wantToLearnList, setWantToLearnList] = useState([]);
  const [songToLearn, setSongToLearn] = useState("");
  const [artistOfSongToLearn, setArtistOfSongToLearn] = useState("");
  const [status, setStatus] = useState("want_to_learn");
  const { session } = UserAuth(); // Get session from AuthContext

  console.log("Session:", session);
  console.log("User ID:", session?.user?.id);

  const { songs, loading, error } = useFetchSongs(session?.user?.id);
  console.log("Fetched songs:", songs);

  const addSongToWantToLearn = async () => {
    const userId = session.user.id; // Access the user ID from session

    console.log("User ID:", userId);

    const newSongToLearn = {
      name: songToLearn,
      artist: artistOfSongToLearn,
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
      setSongToLearn("");
      setArtistOfSongToLearn("");
    }
  };

  return (
    <div>
      <NavBar />
      <h1>My Learning</h1>
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
