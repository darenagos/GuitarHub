import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const UserCustomSongDetailPage = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      const { data, error } = await supabase
        .from("usersChordProgressions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching song:", error);
      else setSong(data);
      setLoading(false);
    };

    fetchSong();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!song) return <p>Song not found</p>;

  return (
    <div>
      <h1>{song.song_name}</h1>
      <p>Chord Sequence: {song.chord_sequence}</p>
    </div>
  );
};

export default UserCustomSongDetailPage;
