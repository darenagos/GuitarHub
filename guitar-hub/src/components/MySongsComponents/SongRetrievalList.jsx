import React from "react";

const SongRetrievalList = ({ searchResults, onSongSelect }) => {
  return (
    <div>
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

export default SongRetrievalList;
