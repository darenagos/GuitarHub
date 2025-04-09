import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router";
import { updateStatus } from "../../../services/songService";
import { deleteSong } from "../../../services/songService";

const SongDetails = ({ song, id }) => {
  const [status, setStatus] = useState(song?.status || "want_to_learn");
  const navigate = useNavigate();
  const statuses = ["want_to_learn", "currently_learning", "learnt"];
  const statusLabels = {
    want_to_learn: "Want to Learn",
    currently_learning: "Currently Learning",
    learnt: "Learnt",
  };

  useEffect(() => {
    if (song) setStatus(song.status);
    console.log("Fetched song data:", song); // Log the song data
  }, [song]);

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);

    const { error } = await updateStatus(id, newStatus);

    if (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDelete = async () => {
    const { error } = await deleteSong(id);

    if (error) {
      console.error("Error deleting song:", error);
      alert("Failed to delete song");
    } else {
      alert("Song deleted successfully.");
      navigate("/learning");
    }
  };

  return (
    <div className="p-1">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Song Details
      </h2>
      <p className="text-xl text-gray-700 mb-4">
        <strong>Song Name:</strong> {song.name}
      </p>
      <p className="text-xl text-gray-700 mb-6">
        <strong>Artist:</strong> {song.artist}
      </p>
      {/* Status Update */}
      <p className="text-l text-gray-800 mb-2">Status tracker</p>
      <div className="space-y-4 mb-6">
        <div className="p-2 bg-white rounded-lg shadow-xs">
          <div className="flex justify-between items-center mb-2">
            {statuses.map((s, index) => (
              <div
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`cursor-pointer text-sm font-medium transition-colors duration-300 ${
                  status === s || statuses.indexOf(status) > index
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                {statusLabels[s]}
              </div>
            ))}
          </div>

          <div className="relative h-3 bg-white rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#e3d8b3] rounded-full transition-all duration-500"
              style={{
                width: `${
                  (statuses.indexOf(status) + 1) * (100 / statuses.length)
                }%`,
              }}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleDelete}
            className=" py-5 rounded-md hover:scale-110 transition-all duration-300s cursor-pointer"
          >
            Delete Song
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
