import React from "react";

type CircleProgressProps = {
  value: number; // current value
  max?: number; // max value (default 100)
  size?: number; // outer size in px (default 120)
  strokeWidth?: number; // stroke width (default 12)
  color?: string; // tailwind color or CSS color (default 'rgb(59 130 246)' — blue-500)
  trackColor?: string; // background track color (default '#e6e6e6')
  showLabel?: boolean; // show percent label in center
  animate?: boolean; // animate transitions
  className?: string; // extra wrapper classes
};

/**
 * CircleProgress (SVG) - simple, accessible circular progress component using Tailwind-friendly classes.
 * - Default export at bottom is a small demo that renders the component.
 * - Use the named export `CircleProgress` in your app to import the component.
 */
export const CircleProgress: React.FC<CircleProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 12,
  color = "rgb(59 130 246)",
  trackColor = "#e6e6e6",
  showLabel = true,
  animate = true,
  className = "",
}) => {
  const safeValue = Math.max(0, Math.min(value, max));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = safeValue / max;
  const dashOffset = circumference * (1 - progress);
  const id = React.useId();

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(safeValue)}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" x2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#grad-${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          style={{
            transition: animate ? "stroke-dashoffset 600ms ease, transform 600ms ease" : undefined,
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>

      {/* Label centered */}
      {showLabel && (
        <div className="absolute flex flex-col items-center justify-center pointer-events-none" style={{ width: size }}>
          <span className="text-sm font-medium leading-none">{Math.round((safeValue / max) * 100)}%</span>
          <span>Uploading file</span>
          <small className="text-[10px] text-gray-500">{Math.round(safeValue)}/{max}</small>
        </div>
      )}
    </div>
  );
};