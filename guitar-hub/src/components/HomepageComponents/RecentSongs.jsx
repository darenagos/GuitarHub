import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import FadePageWrapper from "../HOC/FadePageWrapper";

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
        {/* Header */}
        <h2 className="text-l pt-10 font-semibold mb-4">Your Dashboard</h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display Song Stats */}
          <div className="p-6 border rounded-md shadow-md">
            <h3 className="text-xl font-semibold">Song Status Counts</h3>
            <div className="mt-4">
              <p>Want to Learn: {statusCounts.want_to_learn}</p>
              <p>Currently Learning: {statusCounts.currently_learning}</p>
              <p>Learnt: {statusCounts.learnt}</p>
            </div>
          </div>

          {/* Display Top 3 Most Recent Songs */}
          <div className="p-6 border rounded-md shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Top 3 Most Recent Songs
            </h3>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error fetching songs: {error.message}</p>
            ) : songs.length > 0 ? (
              songs.slice(0, 3).map((song) => (
                <div
                  key={song.jamendo_id}
                  className="mb-4 p-4 border rounded-md shadow-md"
                >
                  <h4 className="text-lg font-semibold">{song.name}</h4>
                  <p>By {song.artist}</p>
                  <p>Status: {song.status}</p>
                  <Link to={`/songs/${song.id}`} className="hover:underline">
                    View Song
                  </Link>
                </div>
              ))
            ) : (
              <p>No recent songs found.</p>
            )}
          </div>

          {/* Display Top 3 Most Recent Chord Progressions */}
          <div className="p-6 border rounded-md shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Top 3 Most Recent Chord Progressions
            </h3>
            {chordProgressions.length > 0 ? (
              chordProgressions.map((progression) => (
                <div
                  key={progression.id}
                  className="mb-4 p-4 border rounded-md shadow-md break-words"
                >
                  <h4 className="text-lg font-semibold ">
                    Chord Progression for {progression.song_name}
                  </h4>
                  <p>
                    Created At:{" "}
                    {new Date(progression.created_at).toLocaleString()}
                  </p>
                  <Link
                    to={`/user-songs/${progression.id}`}
                    className="hover:underline"
                  >
                    View Chord Progression
                  </Link>
                </div>
              ))
            ) : (
              <p>No recent chord progressions found.</p>
            )}
          </div>
        </div>
      </div>
    </FadePageWrapper>
  );
};

export default RecentSongs;
