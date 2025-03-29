import SongItem from "./SongItem";
import FadePageWrapper from "../HOC/FadePageWrapper";

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
    <FadePageWrapper>
      <div className="px-10 py-5">
        <div className=" mx-auto grid grid-cols-3 gap-8 py-10">
          {Object.entries(groupedSongs).map(([status, songs]) => (
            <div className="flex flex-col items-center" key={status}>
              <h3 className="text-3xl text-center py-3 text-gray-800">
                {status.replace("_", " ").toUpperCase()}
              </h3>

              {songs.length > 0 ? (
                <div className="px-5">
                  <ul className="space-y-4">
                    {songs.map((song) => (
                      <SongItem key={song.id} song={song} />
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-center text-gray-600">
                  No songs in this category.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </FadePageWrapper>
  );
};

export default SongList;
