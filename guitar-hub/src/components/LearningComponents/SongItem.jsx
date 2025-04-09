import { Link } from "react-router-dom";

const SongItem = ({ song }) => (
  <li>
    <Link to={`/songs/${song.id}`}>
      <p className="p-2 drop-shadow-[0_4px_2px_rgba(0,0,0,0.1)]">
        {song.name} by {song.artist}
      </p>
    </Link>
  </li>
);

export default SongItem;
