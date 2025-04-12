import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

const AddCustomSongForm = ({ userId, fetchUserSongs }) => {
  const [songName, setSongName] = useState("");
  const [chordSequence, setChordSequence] = useState("");

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
    <div className="flex justify-center items-center pt-10">
      <div className="w-full max-w-xl">
        <div className="space-y-4">
          {/* Form for adding custom songs */}
          <div>
            <input
              type="text"
              placeholder="Song Name"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              className="p-3 w-full border-b-2 border-gray-500 outline-none placeholder-gray-500 text-lg"
            />
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Chord Sequence (comma-separated)"
              value={chordSequence}
              onChange={(e) => setChordSequence(e.target.value)}
              className="p-3 w-full border-b-2 border-gray-500 outline-none placeholder-gray-500 text-lg"
            />
            <div className="flex justify-center">
              <button
                onClick={addCustomSong}
                className="mt-4 p-3 text-gray-800 hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Add My Song
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomSongForm;
