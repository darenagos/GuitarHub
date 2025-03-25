import React from "react";

const UserCustomSongEditForm = ({
  editedSongName,
  setEditedSongName,
  editedChordSequence,
  setEditedChordSequence,
  handleUpdateSong,
  setIsEditing,
}) => {
  return (
    <div>
      <form onSubmit={handleUpdateSong}>
        <label>
          Song Name:
          <input
            type="text"
            value={editedSongName}
            onChange={(e) => setEditedSongName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Chord Sequence:
          <input
            type="text"
            value={editedChordSequence}
            onChange={(e) => setEditedChordSequence(e.target.value)}
            placeholder="e.g. A, C, Bm"
          />
        </label>
        <br />
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UserCustomSongEditForm;
