import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

// useFetchSongs Hook: Fetches all songs for a given user from Supabase, with loading, error, and songs state.

const useFetchSongs = (userId) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSongs = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) {
        setError(error);
        setSongs([]);
      } else {
        setSongs(data);
      }
    } catch (err) {
      setError(err);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  return { songs, loading, error, fetchSongs };
};

export default useFetchSongs;
