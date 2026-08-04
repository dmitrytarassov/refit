import type { HampelConfig } from "./hampel-config";

import { distance } from "../geo/distance";
import type { GpsPoint } from "../track/gps-point";

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function hampel(points: GpsPoint[], cfg: HampelConfig): Set<number> {
  const rejected = new Set<number>();
  if (points.length < 3) {
    return rejected;
  }

  // Raw implied speeds, used only for window statistics. MAD tolerates up to
  // 50% contamination, so outliers in the window do not skew the estimate.
  const rawSpeeds: number[] = [];
  for (let i = 1; i < points.length; i++) {
    const dt = points[i].t - points[i - 1].t;
    rawSpeeds.push(dt > 0 ? distance(points[i - 1], points[i]) / dt : 0);
  }

  let lastAccepted = points[0];
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const dt = p.t - lastAccepted.t;
    if (dt <= 0) {
      rejected.add(p.recordIndex);
      continue;
    }

    const lo = Math.max(0, i - 1 - cfg.windowHalf);
    const hi = Math.min(rawSpeeds.length, i + cfg.windowHalf);
    const window = rawSpeeds.slice(lo, hi);
    const med = median(window);
    const mad = median(window.map((s) => Math.abs(s - med)));
    const sigma = Math.max(1.4826 * mad, cfg.minSigmaMps);

    const impliedSpeed = distance(lastAccepted, p) / dt;
    if (impliedSpeed - med > cfg.nSigmas * sigma) {
      rejected.add(p.recordIndex);
    } else {
      lastAccepted = p;
    }
  }
  return rejected;
}
