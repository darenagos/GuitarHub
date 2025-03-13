import { Link } from "react-router-dom";

const SongItem = ({ song }) => (
  <li>
    {/* <Link to={`/songs/${song.id}`}> */}
    <p>
      {song.name} by {song.artist} (
      {song.status.replace("_", " ").toUpperCase()})
    </p>
    {/* </Link> */}
  </li>
);

export default SongItem;
