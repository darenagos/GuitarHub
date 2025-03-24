import React from "react";
import { Link } from "react-router-dom";

const UserCustomSongList = ({ userSongs }) => {
  return (
    <div>
      <h2>My Created Songs</h2>
      <ul className="grid justify-center">
        {userSongs.map((song) => (
          <div className="p-2 w-xl text-center">
            <li className=" border rounded-md p-2 " key={song.id}>
              <Link to={`/user-songs/${song.id}`}>{song.song_name}</Link>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default UserCustomSongList;
