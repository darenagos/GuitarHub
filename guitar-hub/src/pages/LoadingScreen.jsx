import React, { useEffect, useState } from "react";
import dgChordLogo from "../assets/dgChordLogo.png";

const LoadingScreen = ({ onComplete }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in
    const fadeIn = setTimeout(() => {
      setOpacity(1);
    }, 100);

    // Pulse animation (fade out and in)
    const pulse1 = setTimeout(() => {
      setOpacity(0.5);
    }, 1000);

    const pulse2 = setTimeout(() => {
      setOpacity(1);
    }, 1500);

    const pulse3 = setTimeout(() => {
      setOpacity(0.5);
    }, 2000);

    const pulse4 = setTimeout(() => {
      setOpacity(1);
    }, 2500);

    // Complete after 3 seconds
    const complete = setTimeout(() => {
      setOpacity(0);
      setTimeout(onComplete, 500); // Call onComplete after fade out
    }, 3000);

    // Cleanup timers
    return () => {
      clearTimeout(fadeIn);
      clearTimeout(pulse1);
      clearTimeout(pulse2);
      clearTimeout(pulse3);
      clearTimeout(pulse4);
      clearTimeout(complete);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      <div
        className="flex flex-col items-center justify-center"
        style={{
          opacity,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <img
          src={dgChordLogo}
          alt="GuitarHub Logo"
          className="w-40 h-40 mb-4"
        />
        <h1 className="text-4xl font-semibold text-gray-800">GuitarHub</h1>
      </div>
    </div>
  );
};

export default LoadingScreen;
