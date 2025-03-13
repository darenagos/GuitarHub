import React from "react";

const SongForm = ({
  addSongToWantToLearn,
  songToLearn,
  setSongToLearn,
  artistOfSongToLearn,
  setArtistOfSongToLearn,
  status,
  setStatus,
}) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Name of song: "
        value={songToLearn}
        onChange={(e) => setSongToLearn(e.target.value)}
      />
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
