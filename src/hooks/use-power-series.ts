import { downsamplePoints } from "../fit/downsample-points";
import type { Activity } from "../types/activity";
import type { PowerPoint } from "../types/chart-points";

export function usePowerSeries(activity: Activity): PowerPoint[] {
  const t0 = activity.records.find((r) => r.timestamp)?.timestamp?.getTime();
  if (t0 == null) {
    return [];
  }

  const points: PowerPoint[] = [];
  activity.records.forEach((r, i) => {
    if (!r.timestamp) {
      return;
    }
    const original = r.power;
    const enhanced = activity.powers[i];
    if (original == null && enhanced == null) {
      return;
    }
    const point: PowerPoint = { t: (r.timestamp.getTime() - t0) / 1000 };
    if (original != null) {
      point.original = original;
    }
    if (enhanced != null) {
      point.enhanced = enhanced;
    }
    points.push(point);
  });
  return downsamplePoints(points);
}
