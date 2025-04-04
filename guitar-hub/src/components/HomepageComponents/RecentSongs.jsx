import React, { useState, useEffect, lazy } from "react";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import FadePageWrapper from "../HOC/FadePageWrapper";
import SongStats from "./SongStats";
import RecentSongsList from "./RecentSongsList";
import RecentChordProgressionsList from "./RecentChordProgressionsList";

const RecentSongs = () => {
  const { session } = UserAuth();
  const [songs, setSongs] = useState([]);
  const [chordProgressions, setChordProgressions] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    want_to_learn: 0,
    currently_learning: 0,
    learnt: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongsAndChordProgressions = async () => {
      setLoading(true);
      try {
        // Fetch the top 5 most recent songs from the songs table
        const { data: songData, error: songError } = await supabase
          .from("songs")
          .select("*")
          .eq("user_id", session?.user?.id)
          .order("created_at", { ascending: false })
          .limit(5); // Fetch only the 5 most recent songs

        if (songError) {
          throw new Error(songError.message);
        }

        // Fetch the top 3 most recent chord progressions from usersChordProgressions table
        const { data: progressionData, error: progressionError } =
          await supabase
            .from("usersChordProgressions")
            .select("*")
            .eq("user_id", session?.user?.id)
            .order("created_at", { ascending: false })
            .limit(3); // Fetch only the 3 most recent chord progressions

        if (progressionError) {
          throw new Error(progressionError.message);
        }

        // Count the number of songs in each status
        const statusCounts = {
          want_to_learn: 0,
          currently_learning: 0,
          learnt: 0,
        };

        songData.forEach((song) => {
          if (song.status === "want_to_learn") statusCounts.want_to_learn++;
          if (song.status === "currently_learning")
            statusCounts.currently_learning++;
          if (song.status === "learnt") statusCounts.learnt++;
        });

        setSongs(songData);
        setChordProgressions(progressionData);
        setStatusCounts(statusCounts);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchSongsAndChordProgressions();
    }
  }, [session?.user?.id]);

  return (
    <FadePageWrapper>
      <div className="flex flex-col max-w-6xl mx-auto mb-8 px-6">
        <h2 className="text-l pt-10 font-semibold mb-4">Your Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display Song Stats */}
          <SongStats statusCounts={statusCounts} />

          {/* Display Top 3 Most Recent Songs */}
          <RecentSongsList songs={songs} loading={loading} error={error} />

          {/* Display Top 3 Most Recent Chord Progressions */}
          <RecentChordProgressionsList chordProgressions={chordProgressions} />
        </div>
      </div>
    </FadePageWrapper>
  );
};

export default RecentSongs;
