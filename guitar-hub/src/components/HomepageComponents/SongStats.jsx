import React from "react";
import FadePageWrapper from "../HOC/FadePageWrapper";

const SongStats = ({ statusCounts }) => {
  return (
    <FadePageWrapper>
      <div className="p-6 border rounded-md shadow-md h-full">
        <h3 className="text-xl font-semibold">Song Status Counts</h3>
        <div className="mt-4">
          <p>Want to Learn: {statusCounts.want_to_learn}</p>
          <p>Currently Learning: {statusCounts.currently_learning}</p>
          <p>Learnt: {statusCounts.learnt}</p>
        </div>
      </div>
    </FadePageWrapper>
  );
};

export default SongStats;
