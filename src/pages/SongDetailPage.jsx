import { useParams, Link } from "react-router-dom";
import { useState } from "react";

import FadePageWrapper from "../components/HOC/FadePageWrapper";

import useFetchSong from "../hooks/useFetchSong";
import SongDetails from "../components/LearningComponents/LearningSongDetailPageComponents/SongDetails";
import AudioPlayer from "../components/LearningComponents/LearningSongDetailPageComponents/AudioPlayer";
import ChordDisplaySection from "../components/LearningComponents/LearningSongDetailPageComponents/ChordDisplaySection";
import useFetchAudio from "../hooks/useFetchAudio";

/**
 * SongDetailPage Component
 * Displays the detailed page for a single song, including song info, audio player, and chord sequence.
 * Handles fetching song data and audio, and allows the user to interact with the song's playback.
 */

const SongDetailPage = () => {
  const { id } = useParams();
  const { song, loading: songLoading, error: songError } = useFetchSong(id);
  const [currentSecond, setCurrentSecond] = useState(0);

  const audioUrl = useFetchAudio(song?.jamendo_id);

  // Updates the current time of the song playback
  const handleTimeUpdate = (e) => {
    setCurrentSecond(Math.floor(e.target.currentTime));
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
            <AudioPlayer
              audioUrl={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              preload="auto"
            />
          )}

          <ChordDisplaySection
            chordSequence={song.chord_sequence}
            currentSecond={currentSecond} // Pass the current playback time to sync chords
          />
        </div>
      </div>
    </FadePageWrapper>
  );
};

export default SongDetailPage;
