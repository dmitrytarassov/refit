import type { KalmanConfig } from "./kalman-config.js";
import { initStep } from "./kalman-init.js";
import { processNoise, transition } from "./kalman-model.js";
import type { KalmanResult } from "./kalman-result.js";
import { smoothSegment } from "./kalman-smooth.js";
import type { KalmanStep } from "./kalman-step.js";

import { matAdd, matSub } from "../mat/add-sub.js";
import { identity } from "../mat/create.js";
import { inverse } from "../mat/inverse.js";
import { matMul, matVec } from "../mat/multiply.js";
import { transpose } from "../mat/transpose.js";
import type { Mat, Vec } from "../mat/types.js";
import { vecAdd } from "../mat/vec-ops.js";
import type { GpsPoint } from "../track/gps-point.js";

export function kalmanRts(points: GpsPoint[], cfg: KalmanConfig): KalmanResult {
  const rejected = new Set<number>();
  const smoothed = new Map<number, { x: number; y: number }>();
  if (points.length === 0) {
    return { rejected, smoothed };
  }

  const H: Mat = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
  ];
  const R: Mat = [
    [cfg.gpsSigmaM ** 2, 0],
    [0, cfg.gpsSigmaM ** 2],
  ];

  let segment: KalmanStep[] = [initStep(points[0], cfg)];
  let consecutiveRejects = 0;

  const finalizeSegment = (): void => {
    if (segment.length > 0) {
      smoothSegment(segment, smoothed);
    }
    segment = [];
  };

  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const prev = segment[segment.length - 1];
    const dt = p.t - prev.point.t;

    if (dt <= 0) {
      rejected.add(p.recordIndex);
      continue;
    }
    if (dt > cfg.gapResetS) {
      finalizeSegment();
      segment = [initStep(p, cfg)];
      consecutiveRejects = 0;
      continue;
    }

    const F = transition(dt);
    const xPred = matVec(F, prev.xFilt);
    const PPred = matAdd(
      matMul(matMul(F, prev.PFilt), transpose(F)),
      processNoise(dt, cfg.accelSigmaMps2),
    );

    const innovation: Vec = [p.x - xPred[0], p.y - xPred[1]];
    const S = matAdd(matMul(matMul(H, PPred), transpose(H)), R);
    const SInv = inverse(S);
    const d2 =
      innovation[0] *
        (SInv[0][0] * innovation[0] + SInv[0][1] * innovation[1]) +
      innovation[1] * (SInv[1][0] * innovation[0] + SInv[1][1] * innovation[1]);

    if (d2 > cfg.gateChi2) {
      if (consecutiveRejects + 1 >= cfg.maxConsecutiveRejects) {
        // The track genuinely moved: trust measurements again from here.
        // This point becomes the start of a new segment, not an outlier.
        finalizeSegment();
        segment = [initStep(p, cfg)];
        consecutiveRejects = 0;
      } else {
        rejected.add(p.recordIndex);
        consecutiveRejects++;
      }
      continue;
    }
    consecutiveRejects = 0;

    const K = matMul(matMul(PPred, transpose(H)), SInv);
    const xFilt = vecAdd(xPred, matVec(K, innovation));
    const PFilt = matMul(matSub(identity(4), matMul(K, H)), PPred);
    segment.push({ point: p, F, xPred, PPred, xFilt, PFilt });
  }
  finalizeSegment();

  return { rejected, smoothed };
}
