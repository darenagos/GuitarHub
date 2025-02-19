import React, { useState } from "react";
import SongSearchBar from "./SongSearchBar";

const API_KEY = "05955013";

const SongSearch = ({ onSongSelect }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchSongID = async () => {
    if (!query.trim()) return;
    console.log("Fetching song ID for:", query);

    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${API_KEY}&format=json&limit=5&name=${encodeURIComponent(
      query
    )}`;

    console.log("URL: ", url);

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching song ID:", error);
    }
  };

  return (
    <div>
      <SongSearchBar query={query} setQuery={setQuery} onSearch={fetchSongID} />
      <ul>
        {searchResults.map((song) => (
          <li key={song.id} onClick={() => onSongSelect(song.id)}>
            {song.name} - {song.artist_name} - <strong>Song id: </strong>
            {song.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongSearch;
