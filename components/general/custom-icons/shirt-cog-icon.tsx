import React, { useId } from "react";
import { Shirt } from "lucide-react";

interface ShirtCogIconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ShirtCogIcon({
  size = 48,
  strokeWidth = 2,
  className = "",
}: ShirtCogIconProps) {
  const maskId = useId();

  // The exact cog wheel path paths extracted from Lucide's FileCog
  const CogPaths = () => (
    <>
      <path d="m3.305 19.53.923-.382" />
      <path d="m4.228 16.852-.924-.383" />
      <path d="m5.852 15.228-.383-.923" />
      <path d="m5.852 20.772-.383.924" />
      <path d="m8.148 15.228.383-.923" />
      <path d="m8.53 21.696-.382-.924" />
      <path d="m9.773 16.852.922-.383" />
      <path d="m9.773 19.148.922.383" />
      <circle cx="7" cy="18" r="3" />
    </>
  );

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
        {/* Mask to erase the shirt outline directly behind the cog */}
        <mask id={maskId}>
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          
          {/* Black shape in the mask with an extra thick stroke creates the cutout padding */}
          <g stroke="black" strokeWidth={strokeWidth + 3} fill="black">
            <CogPaths />
          </g>
        </mask>
      </defs>

      {/* Shirt icon with cutout applied */}
      <g mask={`url(#${maskId})`}>
        <Shirt size={24} strokeWidth={strokeWidth} />
      </g>

      {/* FileCog gear paths placed directly at bottom-left (cx: 7, cy: 18) */}
      <g strokeWidth={strokeWidth}>
        <CogPaths />
      </g>
    </svg>
  );
}

export default function App() {
  return (
    <div className="app">
      <ShirtCogIcon size={48} strokeWidth={2} />
    </div>
  );
}