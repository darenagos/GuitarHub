import { useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import useFetchSong from "../hooks/useFetchSong"; // Assuming this hook is handling song details fetch

import ChordSequenceDisplay from "../components/MySongsComponents/ChordSequenceDisplay";
import ChordTimeline from "../components/MySongsComponents/ChordTimeline";

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Assuming you have this setup

const SongDetailPage = () => {
  const { id } = useParams(); // Grabs the song ID from the URL
  const { song, loading: songLoading, error: songError } = useFetchSong(id);

  // States to handle chord sequence
  const [chords, setChords] = useState(null);
  const [chordLoading, setChordLoading] = useState(true);
  const [chordError, setChordError] = useState(null);

  // Fetch the chord sequence for the song from Supabase
  useEffect(() => {
    const fetchChords = async () => {
      setChordLoading(true);
      try {
        const { data, error } = await supabase
          .from("songs")
          .select("chord_sequence")
          .eq("id", id)
          .single(); // Expecting a single row

        if (error) {
          setChordError(error);
          setChords(null); // Clear chords on error
        } else {
          setChords(data.chord_sequence); // Set chord sequence
        }
      } catch (error) {
        setChordError(error);
        setChords(null); // Clear chords on catch error
      } finally {
        setChordLoading(false);
      }
    };

    if (id) {
      // Ensure we only fetch chords if there's a valid song ID
      fetchChords(); // Fetch chords when the song ID changes
    }
  }, [id]); // Ensure it only runs when ID changes

  // Check loading and error for song details
  if (songLoading) return <p>Loading song details...</p>;
  if (songError) return <p>Error loading song: {songError.message}</p>;

  // Loading and error handling for chord sequence
  if (chordLoading) return <p>Loading chord sequence...</p>;
  if (chordError)
    return <p>Error loading chord sequence: {chordError.message}</p>;

  return (
    <div>
      <NavBar />
      <h2>Song Details</h2>
      <p>Song ID: {id}</p>
      <p>Song Name: {song.name}</p>
      <p>Artist: {song.artist}</p>
      <p>Status: {song.status.replace("_", " ").toUpperCase()}</p>

      {/* Display Chord Sequence and Timeline if available */}
      {chords ? (
        chords.length > 0 ? (
          <>
            <ChordSequenceDisplay chords={chords} />
            <div>
              <h2>Chord Timeline</h2>
              <ChordTimeline chords={chords} />
            </div>
          </>
        ) : (
          <p>No chord sequence available for this song.</p>
        )
      ) : (
        <p>Chord data is not available.</p>
      )}
    </div>
  );
};

export default SongDetailPage;
