import React, { useId } from "react";
import { Shirt, Minus } from "lucide-react";

interface BaseShirtIconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function BaseShirtIcon({
  size = 48,
  strokeWidth = 2,
  className = "",
}: BaseShirtIconProps) {
  const maskId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <defs>
        {/* Mask to cut out space on the shirt behind the bottom line */}
        <mask id={maskId}>
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <g transform="translate(0, 10)">
            <Minus
              size={24}
              stroke="black"
              strokeWidth={strokeWidth + 3}
            />
          </g>
        </mask>
      </defs>

      {/* Shirt with cutout mask applied */}
      <g transform="translate(2, 0)" mask={`url(#${maskId})`}>
        <Shirt size={20} strokeWidth={strokeWidth} />
      </g>

      {/* Bottom line overlay */}
      <g transform="translate(0, 10)">
        <Minus size={24} strokeWidth={strokeWidth * 1.3} />
      </g>
    </svg>
  );
}

export default function App() {
  return (
    <div className="app">
      <BaseShirtIcon size={48} strokeWidth={2} />
    </div>
  );
}