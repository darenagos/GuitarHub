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
      <form
        onSubmit={handleUpdateSong}
        className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow w-full max-w-xl"
      >
        {/* Name of song */}
        <label className="text-lg">
          Song Name:
          <input
            type="text"
            value={editedSongName}
            onChange={(e) => setEditedSongName(e.target.value)}
            className="p-2 w-80 max-w-lg border-b-2 border-gray-100 text-lg outline-none placeholder-gray-500"
          />
        </label>

        {/* sequence of chords */}
        <label className="text-lg">
          Chord Sequence:
          <input
            type="text"
            value={editedChordSequence}
            onChange={(e) => setEditedChordSequence(e.target.value)}
            placeholder="e.g. A, C, Bm"
            className="p-2 w-80 max-w-lg border-b-2 border-gray-100 text-lg outline-none placeholder-gray-500"
          />
        </label>

        {/* submit */}
        <div className="flex space-x-4 justify-center">
          <button
            type="submit"
            className="px-4 py-2 rounded-full hover:shadow-[0_0_10px_4px_rgba(156,208,205)] shadow border-2 border-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Save Changes
          </button>
          {/* cancel */}
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 shadow border-2 border-gray-100 rounded-full hover:shadow-[0_0_10px_4px_rgba(156,208,205)]  hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCustomSongEditForm;
