import React from "react";
import FadePageWrapper from "../HOC/FadePageWrapper";
import borderTwo from "../../assets/borderStyles/border-two.png";
import borderThree from "../../assets/borderStyles/border-three.png";
import borderFour from "../../assets/borderStyles/border-four.png";
import progressIcon from "../../assets/icons/progress-icon.jpg";

const borderImages = [borderTwo, borderThree, borderFour];

const SongStats = ({ statusCounts }) => {
  return (
    <FadePageWrapper>
      <div className="bg-white rounded-md shadow-md h-full">
        <div className="flex items-center border-b-2 border-gray-100 p-3 justify-between">
          <h3 className="text-xl font-semibold ">Song Progress Summary</h3>
          <img src={progressIcon} className="ml-5 h-8 w-8" />
        </div>

        <div className="p-4 flex flex-col items-center gap-6">
          {/* Mastered Stat */}
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-orange-400 drop-shadow-[0_0_6px_rgba(255,165,0,0.8)]">
              {statusCounts.mastered}
            </span>
            <span className="text-xs text-gray-500 text-right">Mastered</span>

            <img
              src={borderImages[2]}
              alt="border"
              className="mt-4 w-full object-cover rounded-md opacity-70"
            />
          </div>

          {/* Currently Learning Stat */}
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-orange-400 drop-shadow-[0_0_6px_rgba(255,165,0,0.8)]">
              {statusCounts.learning}
            </span>
            <span className="text-xs text-gray-500 text-center">
              Currently Learning
            </span>

            <img
              src={borderImages[1]}
              alt="border"
              className="mt-4 w-full object-cover rounded-md opacity-70"
            />
          </div>

          {/* Want to Learn Stat */}
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-orange-400 drop-shadow-[0_0_6px_rgba(255,165,0,0.8)]">
              {statusCounts.want_to_learn}
            </span>
            <span className="text-xs text-gray-500 text-center">
              Want to Learn
            </span>

            <img
              src={borderImages[0]}
              alt="border"
              className="mt-4 w-full  object-cover rounded-md opacity-70"
            />
          </div>
        </div>
      </div>
    </FadePageWrapper>
  );
};

export default SongStats;
