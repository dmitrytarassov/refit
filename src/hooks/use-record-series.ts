import { downsamplePoints } from "../fit/downsample-points";
import type { Activity } from "../types/activity";
import type { SeriesPoint } from "../types/chart-points";

export function useRecordSeries(activity: Activity): {
  heartRate: SeriesPoint[];
  cadence: SeriesPoint[];
  elevation: SeriesPoint[];
} {
  const heartRate: SeriesPoint[] = [];
  const cadence: SeriesPoint[] = [];
  const elevation: SeriesPoint[] = [];

  const t0 = activity.records.find((r) => r.timestamp)?.timestamp?.getTime();
  if (t0 != null) {
    for (const r of activity.records) {
      if (!r.timestamp) {
        continue;
      }
      const t = (r.timestamp.getTime() - t0) / 1000;
      const hr = r.heartRate;
      if (typeof hr === "number") {
        heartRate.push({ t, value: hr });
      }
      if (r.cadence != null) {
        cadence.push({ t, value: r.cadence });
      }
      const alt = r.enhancedAltitude ?? r.altitude;
      if (alt != null) {
        elevation.push({ t, value: alt });
      }
    }
  }

  return {
    heartRate: downsamplePoints(heartRate),
    cadence: downsamplePoints(cadence),
    elevation: downsamplePoints(elevation),
  };
}
