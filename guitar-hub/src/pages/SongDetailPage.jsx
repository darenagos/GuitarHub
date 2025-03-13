import { useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import SongItem from "../components/LearningComponents/SongItem";
import useFetchSong from "../hooks/useFetchSong";

const SongDetailPage = () => {
  const { id } = useParams(); // Grabs the song ID from the URL
  const { song, loading, error } = useFetchSong(id);

  if (loading) return <p>Loading song details...</p>;
  if (error) return <p>Error loading song: {error.message}</p>;

  return (
    <div>
      <NavBar />
      <h2>Song Details</h2>
      <p>Song ID: {id}</p>
      <p>Song Name: {song.name}</p>
      <p>Artist: {song.artist}</p>
      <p>Status: {song.status.replace("_", " ").toUpperCase()}</p>
    </div>
  );
};

export default SongDetailPage;
