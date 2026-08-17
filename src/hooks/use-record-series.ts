import { downsamplePoints } from "../fit/downsample-points";
import type { Activity } from "../types/activity";
import type { SeriesPoint } from "../types/chart-points";

export function useRecordSeries(activity: Activity): {
  heartRate: SeriesPoint[];
  cadence: SeriesPoint[];
  elevation: SeriesPoint[];
  speed: SeriesPoint[];
} {
  const heartRate: SeriesPoint[] = [];
  const cadence: SeriesPoint[] = [];
  const elevation: SeriesPoint[] = [];
  const speed: SeriesPoint[] = [];

  const t0 = activity.records.find((r) => r.timestamp)?.timestamp?.getTime();
  if (t0 != null) {
    for (const r of activity.records) {
      if (!r.timestamp) {
        continue;
      }
      const t = (r.timestamp.getTime() - t0) / 1000;
      const d = r.distance;
      const hr = r.heartRate;
      if (typeof hr === "number") {
        heartRate.push({ t, value: hr, d });
      }
      if (r.cadence != null) {
        cadence.push({ t, value: r.cadence, d });
      }
      const alt = r.enhancedAltitude ?? r.altitude;
      if (alt != null) {
        elevation.push({ t, value: alt, d });
      }
      const spd = r.enhancedSpeed ?? r.speed;
      if (spd != null) {
        speed.push({ t, value: Math.round(spd * 36) / 10, d });
      }
    }
  }

  return {
    heartRate: downsamplePoints(heartRate),
    cadence: downsamplePoints(cadence),
    elevation: downsamplePoints(elevation),
    speed: downsamplePoints(speed),
  };
}
