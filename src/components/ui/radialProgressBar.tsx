import React from "react";
import { cn } from "../../lib/utils";

const RadialProgressBar = ({
  progress,
  radius,
  strokeWidth,
  className,
  children,
}: {
  progress: number;
  radius: number;
  strokeWidth: number;
  className?: string;
  children?: React.ReactNode;
}) => {
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <div
      className={cn(
        "w-full h-full relative flex items-center justify-center",
        className,
      )}
    >
      <svg height={radius * 2} width={radius * 2} className="relative z-0">
        {/* Background circle */}
        <circle
          stroke="hsla(0, 0%, 90%, 1)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Foreground circle (progress) */}
        <circle
          stroke="hsl(239, 86%, 74%)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          strokeLinecap="round"
          style={{
            strokeDashoffset: circumference - (progress / 100) * circumference,
            zIndex: 30,
            transition: "stroke-dashoffset 1s ease-out", // Smooth transition for the dash offset
            transform: "rotate(-90deg)", // Ensures it starts from the top
            transformOrigin: "50% 50%", // Keeps the rotation centered
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute z-10 flex justify-center items-center w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default RadialProgressBar;
