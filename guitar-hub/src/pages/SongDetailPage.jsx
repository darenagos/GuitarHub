import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import FadePageWrapper from "../components/HOC/FadePageWrapper";
import useFetchSong from "../hooks/useFetchSong";
import SongDetails from "../components/LearningComponents/LearningSongDetailPageComponents/SongDetails";
import AudioPlayer from "../components/LearningComponents/LearningSongDetailPageComponents/AudioPlayer";
import ChordDisplaySection from "../components/LearningComponents/LearningSongDetailPageComponents/ChordDisplaySection";
import useFetchAudio from "../hooks/useFetchAudio";

const API_KEY = "05955013";

const SongDetailPage = () => {
  const { id } = useParams();
  const { song, loading: songLoading, error: songError } = useFetchSong(id);
  const [currentSecond, setCurrentSecond] = useState(0);
  const navigate = useNavigate();
  const audioUrl = useFetchAudio(song?.jamendo_id);

  const handleTimeUpdate = (e) => {
    setCurrentSecond(Math.floor(e.target.currentTime)); // Update current second
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
          <SongDetails song={song} id={id} />

          {audioUrl && song.chord_sequence?.length > 0 && (
            <AudioPlayer audioUrl={audioUrl} onTimeUpdate={handleTimeUpdate} />
          )}

          <ChordDisplaySection
            chordSequence={song.chord_sequence}
            currentSecond={currentSecond}
          />
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
