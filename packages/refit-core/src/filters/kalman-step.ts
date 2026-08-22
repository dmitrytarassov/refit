import type { Mat, Vec } from "../mat/types.js";
import type { GpsPoint } from "../track/gps-point.js";

/** One forward-filtered point: everything the RTS backward pass needs. */
export interface KalmanStep {
  point: GpsPoint;
  /** Transition from the previous step to this one. */
  F: Mat;
  xPred: Vec;
  PPred: Mat;
  xFilt: Vec;
  PFilt: Mat;
}
