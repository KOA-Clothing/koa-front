"use client";

import React from "react";
import { useToaster } from "react-hot-toast";

interface StackedDeckToasterProps {
  /** Maximum number of toasts visible in the deck simultaneously */
  maxVisible?: number;
  /** Vertical offset in pixels between stacked cards */
  offsetY?: number;
  /** Scale decrease per card depth layer */
  scaleFactor?: number;
}

export const StackedDeckToaster: React.FC<StackedDeckToasterProps> = ({
  maxVisible = 3,
  offsetY = 10,
  scaleFactor = 0.05,
}) => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  // react-hot-toast puts the newest toast at index 0.
  // Slice directly to keep newest at the front.
  const visibleToasts = toasts.slice(0, maxVisible);

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed top-6 left-1/2 -translate-x-1/2 z-9999 pointer-events-none flex flex-col items-center w-[min(92vw,22rem)] h-24 perspective-[1000px]"
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {visibleToasts.map((t, index) => {
        // index 0: Newest toast (Front of deck)
        // index > 0: Older toasts (Layered behind)
        const scale = 1 - index * scaleFactor;
        const translateY = index * offsetY;
        const translateZ = -index * 20;
        const zIndex = maxVisible - index;
        const opacity = t.visible ? 1 - index * 0.15 : 0;

        return (
          <div
            key={t.id}
            className="absolute top-0 w-full pointer-events-auto transition-all duration-300 ease-out origin-top transform-3d"
            style={{
              zIndex,
              opacity,
              transform: `translate3d(0, ${translateY}px, ${translateZ}px) scale(${scale})`,
            }}
          >
            {typeof t.message === "function" ? t.message(t) : t.message}
          </div>
        );
      })}
    </div>
  );
};