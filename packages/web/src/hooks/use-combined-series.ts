import { downsamplePoints } from "../fit/downsample-points";
import type { Activity } from "../types/activity";
import type { CombinedPoint } from "../types/combined-point";

export function useCombinedSeries(activity: Activity): CombinedPoint[] {
  const t0 = activity.records.find((r) => r.timestamp)?.timestamp?.getTime();
  if (t0 == null) {
    return [];
  }

  const points: CombinedPoint[] = [];
  activity.records.forEach((r, i) => {
    if (!r.timestamp) {
      return;
    }
    const p: CombinedPoint = { t: (r.timestamp.getTime() - t0) / 1000 };
    if (r.distance != null) {
      p.d = r.distance;
    }
    const power = activity.powers[i] ?? r.power;
    if (power != null) {
      p.power = power;
    }
    if (typeof r.heartRate === "number") {
      p.heartRate = r.heartRate;
    }
    if (r.cadence != null) {
      p.cadence = r.cadence;
    }
    const alt = r.enhancedAltitude ?? r.altitude;
    if (alt != null) {
      p.elevation = alt;
    }
    const spd = r.enhancedSpeed ?? r.speed;
    if (spd != null) {
      p.speed = Math.round(spd * 36) / 10;
    }
    const hasMetric =
      p.power != null ||
      p.heartRate != null ||
      p.cadence != null ||
      p.elevation != null ||
      p.speed != null;
    if (hasMetric) {
      points.push(p);
    }
  });
  return downsamplePoints(points);
}
