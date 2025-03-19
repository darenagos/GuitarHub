import SongItem from "./SongItem";

const SongList = ({ wantToLearnList }) => {
  const groupedSongs = {
    want_to_learn: [],
    currently_learning: [],
    learnt: [],
  };

  wantToLearnList.forEach((song) => {
    if (groupedSongs[song.status]) {
      groupedSongs[song.status].push(song);
    }
  });

  return (
    <div>
      <p>My Song Categories:</p>

      {Object.entries(groupedSongs).map(([status, songs]) => (
        <div key={status}>
          <h3>{status.replace("_", " ").toUpperCase()}</h3>
          {songs.length > 0 ? (
            <ul>
              {songs.map((song) => (
                <SongItem key={song.id} song={song} />
              ))}
            </ul>
          ) : (
            <p>No songs in this category.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SongList;
