import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router";
import { updateStatus, deleteSong } from "../../../services/songService";
import "./SongDetails.css";

import wantToLearnIcon from "../../../assets/icons/want-to-learn-icon.png";
import learningIcon from "../../../assets/icons/currently-learning-icon.png";
import masteredIcon from "../../../assets/icons/mastered-icon-apple.png";

const SongDetails = ({ song, id }) => {
  const [status, setStatus] = useState(song?.status || "want_to_learn");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const statuses = ["want_to_learn", "learning", "mastered"];
  const statusLabels = {
    want_to_learn: "Want to Learn",
    learning: "Learning",
    mastered: "Mastered",
  };

  const statusIcons = {
    want_to_learn: wantToLearnIcon,
    learning: learningIcon,
    mastered: masteredIcon,
  };

  useEffect(() => {
    if (song) setStatus(song.status);
    console.log("Fetched song data:", song);
  }, [song]);

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setMessage(null);
    setError(null);

    const { error } = await updateStatus(id, newStatus);

    if (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status. Please try again.");
    } else {
    }
  };

  const handleDelete = async () => {
    setMessage(null);
    setError(null);

    const { error } = await deleteSong(id);

    if (error) {
      console.error("Error deleting song:", error);
      setError("Failed to delete song.");
    } else {
      setMessage("Deleting song...");
      setTimeout(() => {
        navigate("/learning");
      }, 2300);
    }
  };

  return (
    <div className="p-1">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Song Details
      </h2>

      {error && (
        <p className="text-red-600 bg-red-100 px-4 py-2 rounded-md mb-4 text-center">
          {error}
        </p>
      )}
      <p className="text-xl mb-4">
        <strong>Song Name:</strong> {song.name}
      </p>
      <p className="text-xl mb-6">
        <strong>Artist:</strong> {song.artist}
      </p>

      <p className="flex justify-center text-m text-gray-500 mb-6">
        Learning Progress
      </p>
      <div className="space-y-4 mb-6">
        <div className="p-2 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            {statuses.map((s, index) => (
              <div
                key={s}
                onClick={(e) => {
                  handleStatusChange(s);

                  const ripple = document.createElement("span");
                  const button = e.currentTarget;
                  const rect = button.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  ripple.className = "ripple";
                  ripple.style.left = `${x - 60}px`;
                  ripple.style.top = `${y - 60}px`;

                  button.appendChild(ripple);

                  setTimeout(() => {
                    ripple.remove();
                  }, 1300);

                  const img = e.currentTarget.querySelector("img");
                  img.classList.add("scale-animation");

                  setTimeout(() => {
                    img.classList.remove("scale-animation");
                  }, 900);
                }}
                className={`relative overflow-hidden flex justify-center items-center cursor-pointer p-2 w-40 h-40 bg-white rounded-full text-sm font-medium drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] hover:scale-105 transition-all ease-in-out ${
                  status === s || statuses.indexOf(status) > index
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
                style={{
                  boxShadow:
                    status === s || statuses.indexOf(status) > index
                      ? "0 0 10px rgba(255, 220, 0)"
                      : "none",
                }}
              >
                <div className="flex flex-col items-center justify-center space-y-2 z-10">
                  <img
                    src={statusIcons[s]}
                    alt={`${statusLabels[s]} icon`}
                    className="w-12 h-auto"
                  />
                  <span>{statusLabels[s]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-start">
          <button
            onClick={handleDelete}
            className="p-2 bg-white border-2 border-transparent hover:border-red-200 hover:scale-102 transition-all cursor-pointer"
          >
            Delete Song
          </button>
        </div>
        {message && (
          <p className="text-green-600 text-center mt-4 p-3 bg-green-50 rounded-md">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SongDetails;
