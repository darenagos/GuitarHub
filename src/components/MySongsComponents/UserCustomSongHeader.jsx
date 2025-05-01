import React from "react";

const UserCustomSongHeader = ({ songName, createdAt, onDelete }) => {
  return (
    <div>
      <h1 className="text-2xl">{songName}</h1>

      <p className="text-sm text-gray-500 mt-2 mb-2">
        Created At: {new Date(createdAt).toLocaleString()}
      </p>

      {/* delete song also in header */}
      <button
        onClick={onDelete}
        className="text-s mt-3 text-gray-500 border-2 border-transparent  px-3 py-1 hover:scale-105 hover:text-gray-700 hover:border-red-300 transition-all duration-300 cursor-pointer"
      >
        Delete Song
      </button>
    </div>
  );
};

export default UserCustomSongHeader;
