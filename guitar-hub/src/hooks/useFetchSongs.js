import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const useFetchSongs = (userId) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("songs")
          .select("*")
          .eq("user_id", userId);

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
    };

    if (userId) {
      fetchSongs();
    }
  }, [userId]);

  return { songs, loading, error };
};

export default useFetchSongs;
