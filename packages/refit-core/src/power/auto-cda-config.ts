import type { RiderPosition } from "./rider-position.js";

/** One rung of the speed ladder: the position held up to `upToMps`. */
export interface AutoCdaStep {
  position: RiderPosition;
  /** Upper speed bound of the step, m/s. Absent on the last step — it is open-ended. */
  upToMps?: number;
}

/**
 * Speed as a proxy for effort: the faster the rider goes, the lower they get.
 * Steps are ordered by ascending speed; around every boundary the CdA of the
 * two neighbouring steps is blended linearly over `blendBandMps`, so power
 * stays continuous — and, given a wide enough band, monotonic in speed.
 */
export interface AutoCdaConfig {
  /** At least one step; only the last one omits `upToMps`. */
  steps: AutoCdaStep[];
  /** Full width of the blend band around each boundary, m/s. 0 — hard switch, as in 0.1.x. */
  blendBandMps: number;
}
