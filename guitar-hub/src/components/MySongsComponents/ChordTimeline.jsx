import React from "react";

const ChordTimeline = ({ chords }) => {
  // Calculate the total duration from the chords
  const totalDuration = Math.max(...chords.map((chord) => chord.end));

  // Ensure totalDuration is valid and not zero
  if (!totalDuration || totalDuration <= 0) {
    console.error("Invalid total duration.");
    return null; // Early return if totalDuration is invalid
  }

  const timelineWidth = 800; // Width of the entire timeline in pixels
  const scale = timelineWidth / totalDuration; // Scale factor based on total duration

  return (
    <div
      style={{
        position: "relative",
        width: `${timelineWidth}px`,
        height: "80px",
        backgroundColor: "#f4f4f4",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        margin: "auto",
        padding: "10px 0",
      }}
    >
      {/* Timeline Markings */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
        }}
      >
        {[...Array(6)].map((_, i) => {
          const timeLabel = ((i * totalDuration) / 5).toFixed(0); // Mark every 20% of the timeline
          return <span key={i}>{timeLabel}s</span>;
        })}
      </div>

      {/* Chords on Timeline */}
      {chords.map((chord, index) => {
        const startPos = chord.start * scale; // Calculate position based on start time
        const width = (chord.end - chord.start) * scale; // Calculate width based on duration

        // Ensure width and startPos are valid
        if (isNaN(startPos) || isNaN(width)) {
          console.error("Invalid chord data:", chord);
          return null; // Skip rendering this chord if invalid
        }

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${startPos}px`,
              width: `${width}px`,
              top: "20px",
              height: "30px",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontWeight: "bold",
              textAlign: "center",
              lineHeight: "30px",
              whiteSpace: "nowrap",
            }}
          >
            {chord.label}
          </div>
        );
      })}
    </div>
  );
};

export default ChordTimeline;
