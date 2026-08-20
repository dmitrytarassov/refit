import { useT } from "./use-translation";

import { formatDistance, formatDuration } from "../fit/format-metrics";
import type { Activity } from "../types/activity";
import type { ActivityMeta } from "../types/activity-meta";
import type { ActivityMetrics } from "../types/activity-metrics";

export function useActivitySummary(activity: Activity): {
  meta: ActivityMeta;
  metrics: ActivityMetrics;
} {
  const { t } = useT();
  const fileId = activity.fit.messages.fileIdMesgs?.[0];
  const session = activity.fit.messages.sessionMesgs?.[0];

  const timeCreated: Date | undefined =
    fileId?.timeCreated ?? activity.records[0]?.timestamp;
  const manufacturer: unknown = fileId?.manufacturer;
  const product: unknown =
    fileId?.productName ?? fileId?.garminProduct ?? fileId?.product;
  const deviceParts = [manufacturer, product]
    .filter((p) => p != null)
    .map(String);

  const meta: ActivityMeta = {
    fileName: activity.fileName,
    sport: session?.sport != null ? String(session.sport) : undefined,
    dateLabel: timeCreated?.toLocaleString(t.locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    deviceLabel: deviceParts.length ? deviceParts.join(" ") : undefined,
  };

  const stamps = activity.records
    .map((r) => r.timestamp)
    .filter((t): t is Date => t != null);
  const spanSeconds = stamps.length
    ? (stamps[stamps.length - 1].getTime() - stamps[0].getTime()) / 1000
    : 0;
  const durationSeconds: number = session?.totalElapsedTime ?? spanSeconds;
  const movingSeconds: number = session?.totalTimerTime ?? durationSeconds;

  const distances = activity.records
    .map((r) => r.distance)
    .filter((d): d is number => typeof d === "number");
  const distanceMeters: number =
    session?.totalDistance ?? distances[distances.length - 1] ?? 0;

  let maxSpeed = 0;
  let hrSum = 0;
  let hrCount = 0;
  for (const r of activity.records) {
    const spd = r.enhancedSpeed ?? r.speed;
    if (typeof spd === "number" && spd > maxSpeed) {
      maxSpeed = spd;
    }
    if (typeof r.heartRate === "number") {
      hrSum += r.heartRate;
      hrCount += 1;
    }
  }

  const metrics: ActivityMetrics = {
    durationLabel: formatDuration(durationSeconds),
    movingLabel: formatDuration(movingSeconds),
    distanceLabel: formatDistance(distanceMeters, t.common.units.km),
    avgPower: activity.powerStats?.avgPower,
    normalizedPower: activity.powerStats?.normalizedPower,
    avgSpeedKmh:
      movingSeconds > 0 && distanceMeters > 0
        ? Math.round((distanceMeters / movingSeconds) * 36) / 10
        : undefined,
    maxSpeedKmh: maxSpeed > 0 ? Math.round(maxSpeed * 36) / 10 : undefined,
    avgHeartRate: hrCount > 0 ? Math.round(hrSum / hrCount) : undefined,
  };

  return { meta, metrics };
}
