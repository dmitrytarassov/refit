import type { RideRow } from "./ride-row";

import { computeTss } from "../../lib/power/compute-tss";
import { estimateFtp } from "../../lib/power/estimate-ftp";
import { powerCurve } from "../../lib/power/power-curve";
import { downsamplePoints } from "../fit/downsample-points";
import { routePoints } from "../fit/route-points";
import type { Activity } from "../types/activity";

export function buildRideRow(
  activity: Activity,
  file: ArrayBuffer,
): Omit<RideRow, "id"> {
  const session = activity.fit.messages.sessionMesgs?.[0];
  const stamps = activity.records
    .map((r) => r.timestamp)
    .filter((t): t is Date => t != null);
  const spanSeconds = stamps.length
    ? (stamps[stamps.length - 1].getTime() - stamps[0].getTime()) / 1000
    : 0;
  const durationSec: number = session?.totalElapsedTime ?? spanSeconds;
  const timerSec: number = session?.totalTimerTime ?? durationSec;
  const distanceM: number = session?.totalDistance ?? 0;

  const ftp = estimateFtp(powerCurve(activity.records, activity.powers));
  const np = activity.powerStats?.normalizedPower;
  return {
    fileName: activity.fileName,
    title: activity.title,
    createdAt: (stamps[0] ?? new Date()).getTime(),
    durationSec,
    distanceM,
    avgPower: activity.powerStats?.avgPower,
    normalizedPower: np,
    ftpWatts: ftp?.watts,
    tss:
      ftp != null && np != null
        ? computeTss(timerSec, np, ftp.watts)
        : undefined,
    settings: activity.settings,
    track: downsamplePoints(routePoints(activity), 200),
    file,
  };
}
