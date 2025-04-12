import React from "react";
import FadePageWrapper from "../HOC/FadePageWrapper";

const SongStats = ({ statusCounts }) => {
  return (
    <FadePageWrapper>
      <div className="border rounded-md shadow-md h-full">
        <h3 className="text-xl font-semibold border-b p-3">
          Song Progress Summary
        </h3>
        <div className="p-4 flex gap-12 justify-center">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-orange-400 drop-shadow-[0_0_6px_rgba(255,165,0,0.8)]">
              {statusCounts.want_to_learn}
            </span>
            <span className="text-xs text-gray-500 text-center">
              Want to Learn
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-orange-400 drop-shadow-[0_0_6px_rgba(255,165,0,0.8)]">
              {statusCounts.learning}
            </span>
            <span className="text-xs text-gray-500 text-center">
              Currently Learning
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-orange-400 drop-shadow-[0_0_6px_rgba(255,165,0,0.8)]">
              {statusCounts.mastered}
            </span>
            <span className="text-xs text-gray-500 text-center">mastered</span>
          </div>
        </div>
      </div>
    </FadePageWrapper>
  );
};

export default SongStats;
