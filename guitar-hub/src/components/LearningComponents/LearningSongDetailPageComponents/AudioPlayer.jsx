import React from "react";

const AudioPlayer = ({ audioUrl, onTimeUpdate }) => {
  return (
    <div className="mt-8 text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Preview Track
      </h2>

      <audio controls className="w-full" onTimeUpdate={onTimeUpdate}>
        <source src={audioUrl} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
