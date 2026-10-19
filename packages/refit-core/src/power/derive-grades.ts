import { GRADE_WINDOW_HALF } from "./grade-window-defaults.js";

/**
 * Grade in percent from altitude and cumulative distance over a ±windowHalf
 * record window, for recordings without a `grade` field (virtual trainers:
 * MyWhoosh, Zwift). Without it the climbs of a virtual course show up as
 * braking (0 W) and the descents as 700–1000 W inertia spikes, because the
 * model attributes every speed change to the rider. `undefined` where either
 * input is missing or the window covers less than 5 m of travel — at a
 * standstill the quantised altitude gives no usable slope.
 */
export function deriveGrades(
  altitudes: Array<number | undefined>,
  distances: Array<number | undefined>,
  windowHalf: number = GRADE_WINDOW_HALF,
): Array<number | undefined> {
  const MIN_TRAVEL_M = 5;
  return altitudes.map((_, i) => {
    const lo = Math.max(0, i - windowHalf);
    const hi = Math.min(altitudes.length - 1, i + windowHalf);
    const altLo = altitudes[lo];
    const altHi = altitudes[hi];
    const distLo = distances[lo];
    const distHi = distances[hi];
    if (altLo == null || altHi == null || distLo == null || distHi == null) {
      return undefined;
    }
    const travel = distHi - distLo;
    if (travel < MIN_TRAVEL_M) {
      return undefined;
    }
    return (100 * (altHi - altLo)) / travel;
  });
}
