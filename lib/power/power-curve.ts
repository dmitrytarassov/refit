import { CURVE_DURATIONS_SEC } from "./curve-durations";
import type { CurvePoint } from "./curve-point";

import type { FitRecord } from "../track/fit-record";

function sampleGrid(
  records: FitRecord[],
  powers: Array<number | undefined>,
): Float64Array {
  const t0 = records.find((r) => r.timestamp)?.timestamp?.getTime();
  if (t0 == null) {
    return new Float64Array(0);
  }
  let lastSec = 0;
  for (const r of records) {
    if (r.timestamp) {
      lastSec = Math.round((r.timestamp.getTime() - t0) / 1000);
    }
  }
  const grid = new Float64Array(lastSec + 1);
  records.forEach((r, i) => {
    if (!r.timestamp) {
      return;
    }
    const sec = Math.round((r.timestamp.getTime() - t0) / 1000);
    grid[sec] = typeof r.power === "number" ? r.power : (powers[i] ?? 0);
  });
  return grid;
}

export function powerCurve(
  records: FitRecord[],
  powers: Array<number | undefined>,
): CurvePoint[] {
  const grid = sampleGrid(records, powers);
  if (grid.length < 2) {
    return [];
  }

  const prefix = new Float64Array(grid.length + 1);
  for (let i = 0; i < grid.length; i++) {
    prefix[i + 1] = prefix[i] + grid[i];
  }

  const points: CurvePoint[] = [];
  for (const d of CURVE_DURATIONS_SEC) {
    if (d > grid.length) {
      break;
    }
    let best = 0;
    for (let i = 0; i + d <= grid.length; i++) {
      const avg = (prefix[i + d] - prefix[i]) / d;
      if (avg > best) {
        best = avg;
      }
    }
    points.push({ durationSec: d, watts: Math.round(best) });
  }
  for (let i = points.length - 2; i >= 0; i--) {
    if (points[i].watts < points[i + 1].watts) {
      points[i].watts = points[i + 1].watts;
    }
  }
  return points;
}
