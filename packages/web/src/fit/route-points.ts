import { semicirclesToDeg } from "refit-core";

import { downsamplePoints } from "./downsample-points";

import type { Activity } from "../types/activity";

export function routePoints(
  activity: Activity,
  original = false,
): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  activity.records.forEach((record, index) => {
    if (record.positionLat == null || record.positionLong == null) {
      return;
    }
    if (!original && activity.verdicts.get(index)?.status !== "accepted") {
      return;
    }
    points.push([
      semicirclesToDeg(record.positionLat),
      semicirclesToDeg(record.positionLong),
    ]);
  });
  return downsamplePoints(points);
}
