import { useState, useEffect } from "react";

// useFetchAudio Hook: Fetches and returns the audio URL for a given track ID from Jamendo API.

const API_KEY = "05955013";

const useFetchAudio = (trackId) => {
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    const fetchAudio = async () => {
      if (!trackId) return;
      try {
        const response = await fetch(
          `https://api.jamendo.com/v3.0/tracks/?client_id=${API_KEY}&format=jsonpretty&limit=1&id=${trackId}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const track = data.results[0];
          setAudioUrl(track.audio);
        } else {
          console.error("Track not found for the provided track ID.");
        }
      } catch (error) {
        console.error("Error fetching audio:", error);
      }
    };

    fetchAudio();
  }, [trackId]);

  return audioUrl;
};

export default useFetchAudio;
