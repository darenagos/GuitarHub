import { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext"; // Import UserAuth

const LearningPage = () => {
  const [wantToLearnList, setWantToLearnList] = useState([]);
  const [songToLearn, setSongToLearn] = useState("");
  const [artistOfSongToLearn, setArtistOfSongToLearn] = useState("");
  const { session } = UserAuth(); // Get session from AuthContext

  // Ensure user is authenticated and get user ID
  useEffect(() => {
    if (session) {
      console.log("User session:", session);
    } else {
      console.log("User is not authenticated");
    }
  }, [session]);

  const addSongToWantToLearn = async () => {
    const userId = session.user.id; // Access the user ID from session

    console.log("User ID:", userId);

    const newSongToLearn = {
      name: songToLearn,
      artist: artistOfSongToLearn,
      status: "want_to_learn",
      user_id: userId, // Pass the user ID here
    };
    const { data, error } = await supabase
      .from("songs")
      .insert([newSongToLearn])
      .single();

    if (error) {
      console.log("error adding song: ", error);
    } else {
      setWantToLearnList((prev) => [...prev, data]);
      setSongToLearn("");
      setArtistOfSongToLearn("");
    }
  };

  return (
    <div>
      <NavBar />
      <h1>My Learning</h1>
      <div>
        <input
          type="text"
          placeholder="Name of song: "
          onChange={(e) => setSongToLearn(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name of artist: "
          onChange={(e) => setArtistOfSongToLearn(e.target.value)}
        />
        <button onClick={addSongToWantToLearn}>
          Add Song to "Want to Learn"
        </button>
      </div>
      <ul></ul>
    </div>
  );
};

export default LearningPage;
