import type { FitRecord } from "./fit-record";
import type { GpsPoint, Track } from "./gps-point";

import { createProjection } from "../geo/create-projection";
import { semicirclesToDeg } from "../geo/semicircles";

export function extractTrack(records: FitRecord[]): Track | null {
  let origin: { lat: number; long: number; t0: number } | null = null;
  for (const r of records) {
    if (
      r.positionLat != null &&
      r.positionLong != null &&
      r.timestamp != null
    ) {
      origin = {
        lat: r.positionLat,
        long: r.positionLong,
        t0: r.timestamp.getTime(),
      };
      break;
    }
  }
  if (!origin) {
    return null;
  }

  const projection = createProjection(
    semicirclesToDeg(origin.lat),
    semicirclesToDeg(origin.long),
  );
  const t0 = origin.t0;

  const points: GpsPoint[] = [];
  records.forEach((r, recordIndex) => {
    if (
      r.positionLat == null ||
      r.positionLong == null ||
      r.timestamp == null
    ) {
      return;
    }
    const { x, y } = projection.toLocal(
      semicirclesToDeg(r.positionLat),
      semicirclesToDeg(r.positionLong),
    );
    points.push({
      recordIndex,
      t: (r.timestamp.getTime() - t0) / 1000,
      x,
      y,
      speed: r.enhancedSpeed ?? r.speed,
    });
  });
  return { points, projection };
}
