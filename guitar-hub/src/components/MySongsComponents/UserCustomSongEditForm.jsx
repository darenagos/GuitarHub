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
    <div className="flex justify-start items-center p-4">
      <form onSubmit={handleUpdateSong} className="flex flex-col space-y-4">
        <label className="text-lg">
          Song Name:
          <input
            type="text"
            value={editedSongName}
            onChange={(e) => setEditedSongName(e.target.value)}
            className="p-2 w-80 max-w-lg border-b-2 border-gray-500 text-lg outline-none placeholder-gray-500"
          />
        </label>

        <label className="text-lg">
          Chord Sequence:
          <input
            type="text"
            value={editedChordSequence}
            onChange={(e) => setEditedChordSequence(e.target.value)}
            placeholder="e.g. A, C, Bm"
            className="p-2 w-80 max-w-lg border-b-2 border-gray-500 text-lg outline-none placeholder-gray-500"
          />
        </label>

        <div className="flex space-x-4 justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-400 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCustomSongEditForm;
