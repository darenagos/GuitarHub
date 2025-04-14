// src/hooks/useFetchSong.js
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const useFetchSong = (id) => {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error);
        console.error("Error fetching song:", error);
      } else {
        setSong(data);
      }
      setLoading(false);
    };

    if (id) fetchSong();
  }, [id]);

  return { song, loading, error };
};

export default useFetchSong;
