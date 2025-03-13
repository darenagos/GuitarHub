import { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext"; // Import UserAuth

import SongForm from "../components/LearningComponents/SongForm";
import SongList from "../components/LearningComponents/SongList";

const LearningPage = () => {
  const [wantToLearnList, setWantToLearnList] = useState([]);
  const [songToLearn, setSongToLearn] = useState("");
  const [artistOfSongToLearn, setArtistOfSongToLearn] = useState("");
  const [status, setStatus] = useState("want_to_learn");
  const { session } = UserAuth(); // Get session from AuthContext

  useEffect(() => {
    if (session) {
      console.log("User session:", session);
      console.log("Session user ID:", session.user.id);

      fetchSongsToLearn(session.user.id);
    } else {
      console.log("User is not authenticated");
    }
  }, [session]);

  const fetchSongsToLearn = async (userId) => {
    console.log("Fetching songs for user:", userId);

    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .eq("user_id", userId);

    console.log("Fetched data:", data);
    console.log("Fetch error:", error);

    if (error) {
      console.log("Error fetching: ", error);
    } else {
      setWantToLearnList(data || []);
      console.log("Updated wantToLearnList:", data);
    }
  };

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
      fetchSongsToLearn(userId);
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
      <SongList wantToLearnList={wantToLearnList} />
    </div>
  );
};

export default LearningPage;
