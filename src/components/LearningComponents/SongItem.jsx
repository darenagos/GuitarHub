import { Link } from "react-router-dom";

const SongItem = ({ song }) => (
  <li>
    <Link to={`/songs/${song.id}`}>
      <p className="p-2 drop-shadow-[0_4px_2px_rgba(0,0,0,0.1)] hover:scale-103 transition-all duration-200 ease-in-out ">
        {song.name} <span className="text-gray-500">by {song.artist}</span>
      </p>
    </Link>
  </li>
);

export default SongItem;
