import React, { useState } from "react";
import { useEffect } from "react";
import { addCustomSong } from "../../services/songService";

import border1 from "../../assets/borderStyles/border-one.png";
import border2 from "../../assets/borderStyles/border-five.png";
import musicIcon from "../../assets/icons/music-icon.png";

/**
 * AddCustomSongForm Component
 * Allows users to add custom songs with a name and chord sequence. Displays success or error messages based on the submission result.
 */

const AddCustomSongForm = ({ userId, fetchUserSongs }) => {
  const [songName, setSongName] = useState("");
  const [chordSequence, setChordSequence] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handles the form submission to add a new song
  const handleAddSong = async () => {
    if (!songName || !chordSequence) {
      setErrorMessage("Please enter a song name and chord sequence");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    const { data, error } = await addCustomSong(
      userId,
      songName,
      chordSequence
    );

    if (error) {
      console.error("Error adding song:", error);
      setErrorMessage("Failed to add song. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    } else {
      setSuccessMessage("Song added successfully!");
      fetchUserSongs(); // Re-fetch to ensure the song is updated in the list
      setSongName(""); //Clear the song name input
      setChordSequence(""); // Clear the chord sequence input
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
        {/* Form for adding a custom song */}
        <div className=" bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4 relative">
            <h2 className="text-s mr-2 group cursor-help flex items-center justify-center gap-x-2">
              Add my song
              <img src={musicIcon} className="h-10 w-auto flex" />
              {/* Tooltip */}
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mt-2 z-10 w-108 opacity-0 
            group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white 
            text-sm rounded p-2 shadow-lg pointer-events-none mb-2"
              >
                <p className="text-xs mb-1">How to add your own song:</p>
                <ol className="text-xs pl-4 list-decimal">
                  <li>
                    Enter your <u>song name</u>
                  </li>
                  <li>
                    Enter your <u>chord sequence</u> (seperate chords with
                    commas)
                  </li>
                  <li>
                    Example: <u>A, B minor, D, G</u>
                  </li>
                  <li>
                    Click the <u>Add My Song</u> button
                  </li>
                </ol>
                <div className="absolute left-1/15 -translate-x-1/15 top-full border-8 border-transparent border-t-gray-800"></div>
              </div>
            </h2>
          </div>
          {/* Error message display */}
          {errorMessage && (
            <div className="text-red-500 text-center mt-4 mb-4 p-3 bg-red-50 transition-all duration-300">
              {errorMessage}
            </div>
          )}

          {/* Song name input */}
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

          {/* Chord sequence input */}
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

            {/* Button to add the song */}
            <div className="flex justify-center">
              <button
                onClick={handleAddSong}
                className="mt-1 p-3 text-orange-400 shadow  hover:text-[#9cd0cd] rounded-full hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Add My Song
              </button>
            </div>
          </div>

          {/* Success message display */}
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
