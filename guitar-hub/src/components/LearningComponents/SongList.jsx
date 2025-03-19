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
      <p className="px-20 py-5">My Song Categories:</p>

      <div className="py-20 px-40 flex justify-center">
        {Object.entries(groupedSongs).map(([status, songs]) => (
          <div className="" key={status}>
            <h3 className="text-2xl py-5">
              {status.replace("_", " ").toUpperCase()}
            </h3>

            {songs.length > 0 ? (
              <div className="px-2 flex justify-center">
                <ul className="outline">
                  {songs.map((song) => (
                    <SongItem key={song.id} song={song} />
                  ))}
                </ul>
              </div>
            ) : (
              <p>No songs in this category.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList;
