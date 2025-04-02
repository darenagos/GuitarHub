import React from "react";

const ChordTimeline = ({ chords, currentSecond }) => {
  const totalDuration = Math.max(...chords.map((chord) => chord.end));
  if (!totalDuration || totalDuration <= 0) {
    console.error("Invalid total duration.");
    return null;
  }

  const scale = 51.45;
  const interval = 20;
  const rows = Math.ceil(totalDuration / interval);

  return (
    <div className="flex flex-col items-center" style={{ margin: "auto" }}>
      {[...Array(rows)].map((_, rowIndex) => {
        const rowStart = rowIndex * interval;
        const rowEnd = (rowIndex + 1) * interval;

        return (
          <div
            key={rowIndex}
            className="relative flex items-center border max-w-5xl"
            style={{
              height: "100px",
              width: "clamp(80vw, 80vh, 80vw)",
              backgroundColor: "#f4f4f4",
              borderRadius: "10px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              marginBottom: "10px",
              position: "relative",
              overflow: "hidden", // Prevent overflow
            }}
          >
            {/* Time Labels */}
            <div
              className="absolute bottom-2 w-full flex justify-between text-xs"
              style={{ fontSize: "12px" }}
            >
              {[...Array(6)].map((_, i) => {
                const timeLabel = (i * (interval / 5) + rowStart).toFixed(2);
                return <span key={i}>{timeLabel}s</span>;
              })}
            </div>

            {/* Current Second Indicator */}
            {currentSecond >= rowStart && currentSecond < rowEnd && (
              <div
                style={{
                  position: "absolute",
                  left: `${(currentSecond - rowStart) * scale}px`, // Position based on current second
                  top: "0",
                  height: "100%",
                  width: "2px",
                  backgroundColor: "red", // Highlight color
                }}
              />
            )}

            {/* Chords Render */}
            {chords
              .filter((chord) => chord.end > rowStart && chord.start < rowEnd)
              .map((chord, index) => {
                const visibleStart = Math.max(chord.start, rowStart);
                const visibleEnd = Math.min(chord.end, rowEnd);
                const left = (visibleStart - rowStart) * scale;
                const width = Math.max((visibleEnd - visibleStart) * scale, 1); // Ensure min width

                return (
                  <div
                    key={`${rowIndex}-${index}`}
                    style={{
                      position: "absolute",
                      left: `${left}px`,
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
                      overflow: "hidden", // Ensure no text overflow
                    }}
                  >
                    {chord.label}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
  // dasdsadsadsadas
  //sdsasad
};

export default ChordTimeline;
