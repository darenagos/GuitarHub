import { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext"; // Import UserAuth

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
      <div>
        <input
          type="text"
          placeholder="Name of song: "
          value={songToLearn}
          onChange={(e) => setSongToLearn(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name of artist: "
          value={artistOfSongToLearn}
          onChange={(e) => setArtistOfSongToLearn(e.target.value)}
        />
        {/* drop down for selecting status */}
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="want_to_learn">Want to Learn</option>
          <option value="currently_learning">Currently Learning</option>
          <option value="learnt">Learnt</option>
        </select>
        <button onClick={addSongToWantToLearn}>
          Add Song to "{status.replace("_", " ").toUpperCase()}"
        </button>
      </div>
      <ul>
        <p>My Song Categories:</p>
        {wantToLearnList && wantToLearnList.length > 0 ? (
          wantToLearnList.map((songs) => (
            <li key={songs.id}>
              <p>
                {songs.name} by {songs.artist}(
                {songs.status.replace("_", " ").toUpperCase()})
              </p>
            </li>
          ))
        ) : (
          <p>No Songs Found.</p>
        )}
      </ul>
    </div>
  );
};

export default LearningPage;
