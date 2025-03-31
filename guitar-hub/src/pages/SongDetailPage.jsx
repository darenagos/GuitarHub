import { useParams, useNavigate, Link } from "react-router-dom";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
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

  if (songLoading) return;
  if (songError) return <p>Error loading song: {songError.message}</p>;

  return (
    <FadePageWrapper>
      <div className=" px-8 pt-10 mt-[10vh] h-[90vh] scrollable-content">
        <div className="max-w-4xl mx-auto text-left">
          <Link
            to="/Learning"
            className="hover:text-gray-700 transition-all ease-in-out text-gray-500 "
          >
            {" "}
            &lt; Back
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Song Details
          </h2>

          <p className="text-xl text-gray-700 mb-4">
            <strong>Song Name:</strong> {song.name}
          </p>
          <p className="text-xl text-gray-700 mb-6">
            <strong>Artist:</strong> {song.artist}
          </p>

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
          </div>

          {song.chord_sequence?.length > 0 ? (
            <>
              <div className="mt-8">
                <ChordSequenceDisplay chords={song.chord_sequence} />
              </div>

              <h2 className="text-2xl font-semibold text-center text-gray-800 mt-6">
                Chord Timeline
              </h2>
              <ChordTimeline chords={song.chord_sequence} />
            </>
          ) : (
            <p className="mt-4 text-lg text-gray-600 text-center">
              No chord sequence available for this song.
            </p>
          )}
        </div>
        <button
          onClick={() => handleDelete()}
          className="w-full text-xl py-10 rounded-md hover:scale-105 transition-all duration-300"
        >
          Delete Song
        </button>
      </div>
    </FadePageWrapper>
  );
};

export default SongDetailPage;
