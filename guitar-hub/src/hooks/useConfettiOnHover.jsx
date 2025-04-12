// src/hooks/useConfettiOnHover.jsx
import { useRef } from "react";
import confetti from "canvas-confetti";

// Named export
export const useConfettiOnHover = () => {
  const hasHovered = useRef(false);

  const triggerConfetti = () => {
    if (!hasHovered.current) {
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 },
      });
      hasHovered.current = true;

      // Optional: Reset hover lock after a moment
      setTimeout(() => (hasHovered.current = false), 1000);
    }
  };

  return triggerConfetti;
};
