import SongItem from "./SongItem";

const SongList = ({ wantToLearnList }) => (
  <ul>
    <p>My Song Categories:</p>
    {wantToLearnList && wantToLearnList.length > 0 ? (
      wantToLearnList.map((song) => <SongItem key={song.id} song={song} />)
    ) : (
      <p>No Songs Found.</p>
    )}
  </ul>
);

export default SongList;
