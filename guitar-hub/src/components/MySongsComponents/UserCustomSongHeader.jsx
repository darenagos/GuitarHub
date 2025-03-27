import React from "react";

const UserCustomSongHeader = ({ songName, onDelete }) => {
  return (
    <div>
      <h1 className="text-2xl">{songName}</h1>
      <button
        onClick={onDelete}
        className="text-s mt-3 text-gray-500 hover:scale-105 hover:text-gray-700 transition-all duration-300 "
      >
        Delete Song
      </button>
    </div>
  );
};

export default UserCustomSongHeader;
