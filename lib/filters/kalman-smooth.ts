import type { KalmanStep } from "./kalman-step";

import { matAdd, matSub } from "../mat/add-sub";
import { inverse } from "../mat/inverse";
import { matMul, matVec } from "../mat/multiply";
import { transpose } from "../mat/transpose";
import { vecAdd, vecSub } from "../mat/vec-ops";

/** Backward RTS pass over one forward-filtered segment. */
export function smoothSegment(
  steps: KalmanStep[],
  out: Map<number, { x: number; y: number }>,
): void {
  const n = steps.length;
  let xNext = steps[n - 1].xFilt;
  let PNext = steps[n - 1].PFilt;
  out.set(steps[n - 1].point.recordIndex, { x: xNext[0], y: xNext[1] });

  for (let k = n - 2; k >= 0; k--) {
    const next = steps[k + 1];
    const cur = steps[k];
    const C = matMul(matMul(cur.PFilt, transpose(next.F)), inverse(next.PPred));
    const xs = vecAdd(cur.xFilt, matVec(C, vecSub(xNext, next.xPred)));
    const Ps = matAdd(
      cur.PFilt,
      matMul(matMul(C, matSub(PNext, next.PPred)), transpose(C)),
    );
    out.set(cur.point.recordIndex, { x: xs[0], y: xs[1] });
    xNext = xs;
    PNext = Ps;
  }
}
