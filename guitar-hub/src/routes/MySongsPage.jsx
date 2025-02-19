import React from "react";
import { useState } from "react";
import NavBar from "../components/Navbar";
import SongSearch from "../components/MySongsComponents/SongSearch";

const MySongsPage = () => {
  const [selectedSongId, setSelectedSongId] = useState(null);

  return (
    <div>
      <h1>My Songs</h1>
      <SongSearch onSongSelect={setSelectedSongId} />
    </div>
  );
};
export default MySongsPage;
