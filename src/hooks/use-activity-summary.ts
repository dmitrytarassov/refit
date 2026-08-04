import { formatDistance, formatDuration } from "../fit/format-metrics";
import type { Activity } from "../types/activity";
import type { ActivityMeta } from "../types/activity-meta";
import type { ActivityMetrics } from "../types/activity-metrics";

export function useActivitySummary(activity: Activity): {
  meta: ActivityMeta;
  metrics: ActivityMetrics;
} {
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
    dateLabel: timeCreated?.toLocaleString(undefined, {
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

  const distances = activity.records
    .map((r) => r.distance)
    .filter((d): d is number => typeof d === "number");
  const distanceMeters: number =
    session?.totalDistance ?? distances[distances.length - 1] ?? 0;

  const metrics: ActivityMetrics = {
    durationLabel: formatDuration(durationSeconds),
    distanceLabel: formatDistance(distanceMeters),
    avgPower: activity.powerStats?.avgPower,
    normalizedPower: activity.powerStats?.normalizedPower,
  };

  return { meta, metrics };
}
