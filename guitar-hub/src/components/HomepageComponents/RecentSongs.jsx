import React, { useState, useEffect, lazy } from "react";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import FadePageWrapper from "../HOC/FadePageWrapper";
import SongStats from "./SongStats";
import RecentSongsList from "./RecentSongsList";
import RecentChordProgressionsList from "./RecentChordProgressionsList";
import { fetchTopThreeMostRecentSongs } from "../../services/songService";
import { fetchTopThreeMostRecentChordProgressions } from "../../services/songService";

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

  // Load cached data immediately if available
  useEffect(() => {
    const cachedSongs = sessionStorage.getItem("recentSongs");
    const cachedChords = sessionStorage.getItem("recentChordProgressions");

    if (cachedSongs) setSongs(JSON.parse(cachedSongs));
    if (cachedChords) setChordProgressions(JSON.parse(cachedChords));

    // Count status from cached songs
    if (cachedSongs) {
      const parsedSongs = JSON.parse(cachedSongs);
      const counts = {
        want_to_learn: 0,
        currently_learning: 0,
        learnt: 0,
      };
      parsedSongs.forEach((song) => {
        if (song.status === "want_to_learn") counts.want_to_learn++;
        if (song.status === "currently_learning") counts.currently_learning++;
        if (song.status === "learnt") counts.learnt++;
      });
      setStatusCounts(counts);
    }

    setLoading(!cachedSongs || !cachedChords); // Show loader only if cache is empty
  }, [session?.user?.id]);

  // Fetch fresh data in the background
  useEffect(() => {
    // console.log("User ID:", session?.user.id);
    const fetchData = async () => {
      try {
        const { data: songData, error: songError } =
          await fetchTopThreeMostRecentSongs(session?.user.id);
        const { data: progressionData, error: progressionError } =
          await fetchTopThreeMostRecentChordProgressions(session?.user.id);

        if (songError) throw new Error(songError.message);
        if (progressionError) throw new Error(progressionError.message);

        // Save and set data
        setSongs(songData);
        sessionStorage.setItem("recentSongs", JSON.stringify(songData));

        setChordProgressions(progressionData);
        sessionStorage.setItem(
          "recentChordProgressions",
          JSON.stringify(progressionData)
        );

        const counts = {
          want_to_learn: 0,
          currently_learning: 0,
          learnt: 0,
        };
        songData.forEach((song) => {
          if (song.status === "want_to_learn") counts.want_to_learn++;
          if (song.status === "currently_learning") counts.currently_learning++;
          if (song.status === "learnt") counts.learnt++;
        });
        setStatusCounts(counts);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) fetchData();
  }, [session?.user?.id]);

  return (
    <FadePageWrapper>
      <div className="flex flex-col max-w-6xl  mx-auto  mb-8 px-6">
        <h2 className="text-l pt-10 font-semibold mb-4">Your Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
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
