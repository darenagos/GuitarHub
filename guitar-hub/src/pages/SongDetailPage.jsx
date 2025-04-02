import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import useFetchSong from "../hooks/useFetchSong";
import ChordSequenceDisplay from "../components/ChordSequenceComponents/ChordSequenceDisplay";
import ChordTimeline from "../components/ChordSequenceComponents/ChordTimeline";

const API_KEY = "05955013";

const SongDetailPage = () => {
  const { id } = useParams();
  const { song, loading: songLoading, error: songError } = useFetchSong(id);
  const [status, setStatus] = useState(song?.status || "want_to_learn");
  const [audioUrl, setAudioUrl] = useState(null);
  const [currentSecond, setCurrentSecond] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (song) setStatus(song.status);
    console.log("Fetched song data:", song); // Log the song data
  }, [song]);

  // Fetch track audio from Jamendo API
  useEffect(() => {
    if (song?.artist) {
      console.log("song jamendo id:", song.jamendo_id);
      fetchAudio(song.jamendo_id);
    }
  }, [song]);

  useEffect(() => {
    if (song && song.chord_sequence) {
      console.log("Chord sequence for the song:", song.chord_sequence);
    }
  }, [song]);
  const fetchAudio = async (trackId) => {
    try {
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${API_KEY}&format=jsonpretty&limit=1&id=${trackId}`
      );
      console.log("response", response);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const track = data.results[0]; // Track details
        const audioUrl = track.audio; // Access the audio URL

        console.log("Audio URL:", audioUrl); // Log the audio URL
        setAudioUrl(audioUrl); // You can use the URL to play the track
      } else {
        console.error("Track not found for the provided track ID.");
      }
    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  const handleTimeUpdate = (e) => {
    setCurrentSecond(Math.floor(e.target.currentTime)); // Update current second
  };

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

  if (songLoading) return <p>Loading...</p>;
  if (songError) return <p>Error loading song: {songError.message}</p>;

  return (
    <FadePageWrapper>
      <div className="px-8 pt-10 mt-[10vh] h-[90vh] scrollable-content">
        <div className="max-w-4xl mx-auto text-left">
          <Link
            to="/Learning"
            className="hover:text-gray-700 transition-all ease-in-out text-gray-500 "
          >
            &lt; Back to learning
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
          </div>
          {/* Chord Display */}

          {/* Audio Player */}
          {audioUrl && song.chord_sequence?.length > 0 && (
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Preview Track
              </h2>

              <audio
                controls
                className="w-full"
                onTimeUpdate={handleTimeUpdate}
              >
                <source src={audioUrl} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          {song.chord_sequence?.length > 0 ? (
            <>
              <div className="mt-8">
                <ChordSequenceDisplay chords={song.chord_sequence} />
              </div>

              <h2 className="text-2xl font-semibold text-center text-gray-800 mt-6">
                Chord Timeline
              </h2>
              <ChordTimeline
                chords={song.chord_sequence}
                currentSecond={currentSecond}
              />
            </>
          ) : (
            <p className="mt-4 text-lg text-gray-600 text-center">
              No chord sequence available for this song.
            </p>
          )}
        </div>

        <button
          onClick={handleDelete}
          className="w-full text-xl py-10 rounded-md hover:scale-105 transition-all duration-300"
        >
          Delete Song
        </button>
      </div>
    </FadePageWrapper>
  );
};

export default SongDetailPage;
