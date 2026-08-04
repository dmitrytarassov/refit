import { semicirclesToDeg } from "../../lib/geo/semicircles";
import { downsamplePoints } from "../fit/downsample-points";
import type { Activity } from "../types/activity";

export function useRoutePoints(activity: Activity): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  activity.records.forEach((record, index) => {
    if (record.positionLat == null || record.positionLong == null) {
      return;
    }
    if (activity.verdicts.get(index)?.status !== "accepted") {
      return;
    }
    points.push([
      semicirclesToDeg(record.positionLat),
      semicirclesToDeg(record.positionLong),
    ]);
  });
  return downsamplePoints(points);
}
