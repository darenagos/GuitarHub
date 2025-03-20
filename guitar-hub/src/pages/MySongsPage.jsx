import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import NavBar from "../components/Navbar";
import SongSearch from "../components/MySongsComponents/SongSearch";
import ChordSequenceDisplay from "../components/MySongsComponents/ChordSequenceDisplay";
import ChordTimeline from "../components/MySongsComponents/ChordTimeline";
import { UserAuth } from "../context/AuthContext"; // Import UserAuth

const MySongsPage = () => {
  const { session } = UserAuth(); // Get session from AuthContext
  const userId = session?.user?.id; // Get user ID
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [chords, setChords] = useState([]);
  const [userSongs, setUserSongs] = useState([]);
  const [songName, setSongName] = useState("");
  const [chordSequence, setChordSequence] = useState("");

  useEffect(() => {
    console.log("User ID:", userId); // Log userId to confirm it
    if (userId) fetchUserSongs();
  }, [userId]);

  const fetchChords = async (songId) => {
    const url = `http://audio-analysis.eecs.qmul.ac.uk/function/analysis/audiocommons/jamendo-tracks:${songId}?descriptors=chords`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setChords(data.chords.chordSequence);
    } catch (error) {
      console.error("Error fetchings chords:", error);
      setChords(null);
    }
  };

  const fetchUserSongs = async () => {
    if (!userId) {
      console.log("User ID is not available");
      return;
    }

    const { data, error } = await supabase
      .from("usersChordProgressions")
      .select("*")
      .eq("user_id", userId); // Fetch only songs belonging to the logged-in user

    if (error) {
      console.error("Error fetching user songs:", error);
    } else {
      console.log("Fetched user songs:", data); // Log fetched data
      setUserSongs(data); // Set the user songs state
    }
  };

  const addCustomSong = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    if (!songName || !chordSequence) {
      alert("Please enter a song name and chord sequence");
      return;
    }

    // Convert chordSequence to a JSON array format
    const chordArray = chordSequence.split(",").map((chord) => chord.trim());

    const { data, error } = await supabase
      .from("usersChordProgressions")
      .insert([
        {
          user_id: userId, // Ensure user_id is included
          song_name: songName,
          chord_sequence: JSON.stringify(chordArray), // Insert as JSON array
        },
      ])
      .single(); // Use .single() to get the inserted row directly

    if (error) {
      console.error("Error adding song:", error);
    } else {
      // Re-fetch the user songs after adding a new song
      fetchUserSongs(); // Re-fetch to ensure the song is updated in the list
      setSongName("");
      setChordSequence("");
    }
  };

  return (
    <>
      <div>
        <NavBar />
        <h1>My Songs</h1>
        <SongSearch
          onSongSelect={(id) => {
            setSelectedSongId(id);
            fetchChords(id);
          }}
        />
        {selectedSongId && <ChordSequenceDisplay chords={chords} />}
        <div>
          <h2>Chord Timeline</h2>
          <ChordTimeline chords={chords} />
        </div>

        {/* Form for adding custom songs */}
        <div>
          <input
            type="text"
            placeholder="Song Name"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Chord Sequence (comma-separated)"
            value={chordSequence}
            onChange={(e) => setChordSequence(e.target.value)}
          />
          <button onClick={addCustomSong}>Add My Song</button>
        </div>

        {/* Display list of user-created songs */}
        <h2>My Created Songs</h2>
        <ul className="grid justify-center">
          {userSongs.map((song) => (
            <div className="p-2 w-xl text-center">
              <li className=" border rounded-md p-2 " key={song.id}>
                <Link to={`/user-songs/${song.id}`}>{song.song_name}</Link>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MySongsPage;
