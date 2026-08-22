import type { LocalProjection } from "../geo/local-projection.js";

/** A GPS fix extracted from a record, projected into local metric coordinates. */
export interface GpsPoint {
  /** Index into the original recordMesgs array. */
  recordIndex: number;
  /** Seconds since the first GPS fix. */
  t: number;
  x: number;
  y: number;
  /** Device-reported speed, m/s (may be missing). */
  speed?: number;
}

export interface Track {
  points: GpsPoint[];
  projection: LocalProjection;
}
