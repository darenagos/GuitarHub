import React, { useState } from "react";

const API_KEY = "05955013";

const SongForm = ({
  addSongToWantToLearn,
  songToLearn,
  setSongToLearn,
  artistOfSongToLearn,
  setArtistOfSongToLearn,
  status,
  setStatus,
}) => {
  const [suggestions, setSuggestions] = useState([]);

  const fetchSongSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${API_KEY}&format=json&limit=8&search=${query}`
      );
      const data = await response.json();
      setSuggestions(data.results);
    } catch (error) {
      console.error("Error fetching song suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    setSongToLearn(e.target.value);
    fetchSongSuggestions(e.target.value);
  };

  const handleSelectSong = (song) => {
    setSongToLearn(song.name);
    setArtistOfSongToLearn(song.artist_name);
    setSuggestions([]); // Hide suggestions
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Name of song: "
        value={songToLearn}
        onChange={handleInputChange}
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((song) => (
            <li key={song.id} onClick={() => handleSelectSong(song)}>
              {song.name} - {song.artist_name}
            </li>
          ))}
        </ul>
      )}
      <input
        type="text"
        placeholder="Name of artist: "
        value={artistOfSongToLearn}
        onChange={(e) => setArtistOfSongToLearn(e.target.value)}
      />
      {/* drop down for selecting status */}
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="want_to_learn">Want to Learn</option>
        <option value="currently_learning">Currently Learning</option>
        <option value="learnt">Learnt</option>
      </select>
      <button onClick={addSongToWantToLearn}>
        Add Song to "{status.replace("_", " ").toUpperCase()}"
      </button>
    </div>
  );
};

export default SongForm;
