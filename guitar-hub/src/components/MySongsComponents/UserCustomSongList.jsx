import React from "react";
import { Link } from "react-router-dom";

const UserCustomSongList = ({ userSongs }) => {
  return (
    <div className="flex justify-center items-center w-full max-w-full">
      <div className="p-3">
        <h2 className="m-5">My Created Songs :</h2>
        <ul className="grid justify-center">
          {userSongs.map((song) => (
            <div className="p-2 w-xl text-center">
              <li
                className=" border rounded-sm p-2 hover:bg-[#ffff] transition-all duration-300 ease-in-out"
                key={song.id}
              >
                <Link to={`/user-songs/${song.id}`}>{song.song_name}</Link>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserCustomSongList;
