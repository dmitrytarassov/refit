import type { ReactElement } from "react";

import { ZONE_TARGETS } from "../../planner/planner-zones";

interface WorkoutZoneLinesProps {
  yMax: number;
}

/** Dotted line at the lower bound of every zone from Z2 up (the block targets), Z1 labelled at the baseline. */
export function WorkoutZoneLines({
  yMax,
}: WorkoutZoneLinesProps): ReactElement {
  const bounds = ZONE_TARGETS.slice(1);
  return (
    <>
      <span className="workout-zone-label is-baseline" style={{ bottom: 0 }}>
        Z1
      </span>
      {bounds.map((fraction, i) => {
        const bottom = `${(fraction / yMax) * 100}%`;
        return (
          <span key={fraction}>
            <span className="workout-zone-line" style={{ bottom }} />
            <span className="workout-zone-label" style={{ bottom }}>
              Z{i + 2}
            </span>
          </span>
        );
      })}
    </>
  );
}
