import React from "react";
import FadePageWrapper from "../../HOC/FadePageWrapper";

const AudioPlayer = ({ audioUrl, onTimeUpdate, preload = "auto" }) => {
  return (
    <FadePageWrapper>
      <div className="mt-8 text-center p-2 mt-10  rounded-lg  ">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">
          Preview Track
        </h2>

        <FadePageWrapper>
          <audio
            controls
            className="w-full rounded-full shadow-xs "
            onTimeUpdate={onTimeUpdate}
            preload={preload}
          >
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </FadePageWrapper>
      </div>
    </FadePageWrapper>
  );
};

export default AudioPlayer;
