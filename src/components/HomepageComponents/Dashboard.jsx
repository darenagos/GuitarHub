import React, { useState, useEffect } from "react";
import { UserAuth } from "../../context/AuthContext";
import FadePageWrapper from "../HOC/FadePageWrapper";
import SongStats from "./SongStats";
import RecentSongsList from "./RecentSongsList";
import RecentChordProgressionsList from "./RecentChordProgressionsList";
import {
  fetchLearningSongs,
  fetchTopThreeMostRecentSongs,
} from "../../services/songService";
import { fetchTopThreeMostRecentChordProgressions } from "../../services/songService";

import star from "../../assets/icons/star.png";

const Dashboard = () => {
  const { session } = UserAuth();
  const [songs, setSongs] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [chordProgressions, setChordProgressions] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    want_to_learn: 0,
    learning: 0,
    mastered: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cached data immediately if available
  useEffect(() => {
    const cachedSongs = sessionStorage.getItem("recentSongs");
    const cachedChords = sessionStorage.getItem("recentChordProgressions");

    if (cachedSongs) setRecentSongs(JSON.parse(cachedSongs));
    if (cachedChords) setChordProgressions(JSON.parse(cachedChords));

    // Count status from cached songs
    if (cachedSongs) {
      const parsedSongs = JSON.parse(cachedSongs);
      const counts = {
        want_to_learn: 0,
        learning: 0,
        mastered: 0,
      };
      parsedSongs.forEach((song) => {
        if (song.status === "want_to_learn") counts.want_to_learn++;
        if (song.status === "learning") counts.learning++;
        if (song.status === "mastered") counts.mastered++;
      });
      setStatusCounts(counts);
    }

    setLoading(!cachedSongs || !cachedChords); // Show loader only if cache is empty
  }, [session?.user?.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all songs the user has access to
        const { data: allSongData, error: allSongsError } =
          await fetchLearningSongs(session?.user.id);

        // Fetch the top 3 most recent songs
        const { data: songData, error: songError } =
          await fetchTopThreeMostRecentSongs(session?.user.id);

        // Fetch the top 3 most recent chord progressions
        const { data: progressionData, error: progressionError } =
          await fetchTopThreeMostRecentChordProgressions(session?.user.id);

        if (allSongsError) throw new Error(allSongsError.message);
        if (songError) throw new Error(songError.message);
        if (progressionError) throw new Error(progressionError.message);

        setSongs(allSongData);
        setRecentSongs(songData);
        setChordProgressions(progressionData);

        sessionStorage.setItem("recentSongs", JSON.stringify(songData));
        sessionStorage.setItem(
          "recentChordProgressions",
          JSON.stringify(progressionData)
        );

        // Count statuses
        const counts = {
          want_to_learn: 0,
          learning: 0,
          mastered: 0,
        };
        allSongData.forEach((song) => {
          if (song.status === "want_to_learn") counts.want_to_learn++;
          if (song.status === "learning") counts.learning++;
          if (song.status === "mastered") counts.mastered++;
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
      <div className="flex flex-col max-w-6xl mx-auto mb-8 px-6">
        <div className="flex justify-start items-center">
          <h2 className="text-l pt-10 font-semibold mb-4">My Dashboard</h2>
          <div className=" ml-2">
            <img src={star} className="h-7 w-7" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display Song Stats */}
          <SongStats statusCounts={statusCounts} />
          {/* Display Top 3 Most Recent Songs */}
          <RecentSongsList
            songs={recentSongs}
            loading={loading}
            error={error}
          />
          {/* Display Top 3 Most Recent Chord Progressions */}
          <RecentChordProgressionsList chordProgressions={chordProgressions} />
        </div>
      </div>
    </FadePageWrapper>
  );
};

export default Dashboard;
