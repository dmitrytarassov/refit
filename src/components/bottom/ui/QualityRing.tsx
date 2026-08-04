import type { ReactElement } from "react";

import "./QualityRing.css";

interface QualityRingProps {
  percent: number;
}

export function QualityRing({ percent }: QualityRingProps): ReactElement {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  return (
    <svg
      className="quality-ring"
      viewBox="0 0 96 96"
      width="96"
      height="96"
      role="img"
      aria-label={`Quality score ${percent} percent`}
    >
      <circle
        cx="48"
        cy="48"
        r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth="8"
      />
      <circle
        cx="48"
        cy="48"
        r={radius}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 48 48)"
      />
      <text
        x="48"
        y="48"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--text-primary)"
      >
        {percent}%
      </text>
    </svg>
  );
}
