import type { ReactElement } from "react";

import { formatClock } from "../../planner/format-clock";

interface WorkoutTimeAxisProps {
  axis: number;
  tickStep: number;
}

export function WorkoutTimeAxis({
  axis,
  tickStep,
}: WorkoutTimeAxisProps): ReactElement {
  const ticks: number[] = [];
  for (let s = 0; s <= axis; s += tickStep) {
    ticks.push(s);
  }
  return (
    <div className="workout-time-axis">
      {ticks.map((s) => (
        <span
          key={s}
          className="workout-time-tick"
          style={{ left: `${(s / axis) * 100}%` }}
        >
          {formatClock(s)}
        </span>
      ))}
    </div>
  );
}
