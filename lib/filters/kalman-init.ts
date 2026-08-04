import type { KalmanConfig } from "./kalman-config";
import type { KalmanStep } from "./kalman-step";

import { identity } from "../mat/create";
import type { Mat, Vec } from "../mat/types";
import type { GpsPoint } from "../track/gps-point";

export function initStep(p: GpsPoint, cfg: KalmanConfig): KalmanStep {
  const x: Vec = [p.x, p.y, 0, 0];
  const r2 = cfg.gpsSigmaM ** 2;
  const v2 = cfg.initVelocitySigmaMps ** 2;
  const P: Mat = [
    [r2, 0, 0, 0],
    [0, r2, 0, 0],
    [0, 0, v2, 0],
    [0, 0, 0, v2],
  ];
  return { point: p, F: identity(4), xPred: x, PPred: P, xFilt: x, PFilt: P };
}
