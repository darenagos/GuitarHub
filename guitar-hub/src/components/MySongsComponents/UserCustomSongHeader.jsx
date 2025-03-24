import React from "react";

const UserCustomSongHeader = ({ songName, onDelete }) => {
  return (
    <div>
      <h1>{songName}</h1>
      <button onClick={onDelete}>Delete Song</button>
    </div>
  );
};

export default UserCustomSongHeader;
