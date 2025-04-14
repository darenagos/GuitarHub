import React, { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../../supabaseClient";
import border1 from "../../assets/borderStyles/border-one.png"; // Import the border image
import border2 from "../../assets/borderStyles/border-five.png"; // Import the border image
import musicIcon from "../../assets/icons/music-icon.png"; // Import the music note icon

const AddCustomSongForm = ({ userId, fetchUserSongs }) => {
  const [songName, setSongName] = useState("");
  const [chordSequence, setChordSequence] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const addCustomSong = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    if (!songName || !chordSequence) {
      setErrorMessage("Please enter a song name and chord sequence");
      setTimeout(() => setErrorMessage(""), 5000); // Clear after 3 seconds
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
      setErrorMessage("Failed to add song. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    } else {
      // Re-fetch the user songs after adding a new song
      setSuccessMessage("Song added successfully!");
      fetchUserSongs(); // Re-fetch to ensure the song is updated in the list
      setSongName("");
      setChordSequence("");
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="flex justify-center items-center pt-3">
      <div className="w-full max-w-xl">
        <div className=" bg-white p-6 rounded-lg shadow-md">
          {/* Form for adding custom songs */}
          <div className="flex items-center mb-4">
            <h2 className="text-s mr-2">Add my song </h2>
            <img src={musicIcon} className="h-10 w-auto" />
          </div>
          {errorMessage && (
            <div className="text-red-500 text-center mt-4 mb-4 p-3 bg-red-50 transition-all duration-300">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Song Name"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              className="p-3 w-full  outline-none placeholder-gray-500 text-m border-2 border-gray-100 rounded-full"
            />
            <img
              src={border1}
              className=" w-80 opacity-60 pointer-events-none"
            />
          </div>
          <div className=" flex flex-col items-center">
            <input
              type="text"
              placeholder="Chord Sequence (comma-separated)"
              value={chordSequence}
              onChange={(e) => setChordSequence(e.target.value)}
              className="p-3 w-full outline-none placeholder-gray-500 text-m border-2 border-gray-100 rounded-full"
            />
            <img
              src={border2}
              className=" w-80 opacity-60 pointer-events-none"
            />
            <div className="flex justify-center">
              <button
                onClick={addCustomSong}
                className="mt-1 p-3 text-orange-400 shadow  hover:text-[#9cd0cd] rounded-full hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Add My Song
              </button>
            </div>
          </div>
          {successMessage && (
            <p className="text-green-600 text-center mt-4 p-3 bg-green-50 rounded-md">
              {successMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCustomSongForm;
