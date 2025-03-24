import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import useFetchSong from "../hooks/useFetchSong";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ChordSequenceDisplay from "../components/ChordSequenceComponents/ChordSequenceDisplay";
import ChordTimeline from "../components/ChordSequenceComponents/ChordTimeline";

const SongDetailPage = () => {
  const { id } = useParams();
  const { song, loading: songLoading, error: songError } = useFetchSong(id);
  const [status, setStatus] = useState(song?.status || "want_to_learn");

  const navigate = useNavigate();

  useEffect(() => {
    if (song) setStatus(song.status);
  }, [song]);

  // Function to handle status change and update it in the database
  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus); // Update local state

    // Update the status in Supabase
    const { error } = await supabase
      .from("songs")
      .update({ status: newStatus }) // Set the new status
      .eq("id", id); // Find the specific song by ID

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
      alert("Song deleted succesfully.");
      navigate("/learning");
    }
  };

  if (songLoading) return <p>Loading song details...</p>;
  if (songError) return <p>Error loading song: {songError.message}</p>;

  return (
    <div>
      <NavBar />
      <h2>Song Details</h2>
      <p>Song Name: {song.name}</p>
      <p>Artist: {song.artist}</p>

      <p>Status:</p>
      {/* Checkboxes for each status */}
      <label>
        <input
          type="checkbox"
          checked={status === "want_to_learn"}
          onChange={() => handleStatusChange("want_to_learn")}
        />
        Want to Learn
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={status === "currently_learning"}
          onChange={() => handleStatusChange("currently_learning")}
        />
        Currently Learning
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={status === "learnt"}
          onChange={() => handleStatusChange("learnt")}
        />
        Learnt
      </label>
      <p></p>
      <button className="text-xl" onClick={() => handleDelete()}>
        Delete Song
      </button>
      {song.chord_sequence?.length > 0 ? (
        <>
          <ChordSequenceDisplay chords={song.chord_sequence} />
          <h2>Chord Timeline</h2>
          <ChordTimeline chords={song.chord_sequence} />
        </>
      ) : (
        <p>No chord sequence available for this song.</p>
      )}
    </div>
  );
};

export default SongDetailPage;
