import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router";

const SongDetails = ({ song, id }) => {
  const [status, setStatus] = useState(song?.status || "want_to_learn");
  const navigate = useNavigate();

  useEffect(() => {
    if (song) setStatus(song.status);
    console.log("Fetched song data:", song); // Log the song data
  }, [song]);

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);

    const { error } = await supabase
      .from("songs")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("songs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting song:", error);
      alert("Failed to delete song");
    } else {
      alert("Song deleted successfully.");
      navigate("/learning");
    }
  };

  return (
    <div>
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
      <p className="text-xl text-gray-800 mb-2">Status:</p>
      <div className="space-y-4 mb-6">
        <label className="flex items-center text-lg text-gray-700">
          <input
            type="checkbox"
            checked={status === "want_to_learn"}
            onChange={() => handleStatusChange("want_to_learn")}
            className="mr-2"
          />
          Want to Learn
        </label>

        <label className="flex items-center text-lg text-gray-700">
          <input
            type="checkbox"
            checked={status === "currently_learning"}
            onChange={() => handleStatusChange("currently_learning")}
            className="mr-2"
          />
          Currently Learning
        </label>

        <label className="flex items-center text-lg text-gray-700">
          <input
            type="checkbox"
            checked={status === "learnt"}
            onChange={() => handleStatusChange("learnt")}
            className="mr-2"
          />
          Learnt
        </label>
        <button
          onClick={handleDelete}
          className=" py-5 rounded-md hover:scale-110 transition-all duration-300s"
        >
          Delete Song
        </button>
      </div>
    </div>
  );
};

export default SongDetails;
