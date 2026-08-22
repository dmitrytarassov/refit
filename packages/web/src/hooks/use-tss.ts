import { computeTss } from "refit-core";

import { useFTP } from "./use-ftp";

import type { Activity } from "../types/activity";

export function useTSS(activity: Activity): number | null {
  const ftp = useFTP(activity);
  const np = activity.powerStats?.normalizedPower;
  if (ftp == null || np == null) {
    return null;
  }

  const session = activity.fit.messages.sessionMesgs?.[0];
  const stamps = activity.records
    .map((r) => r.timestamp)
    .filter((t): t is Date => t != null);
  const spanSeconds = stamps.length
    ? (stamps[stamps.length - 1].getTime() - stamps[0].getTime()) / 1000
    : 0;
  const durationSec: number =
    session?.totalTimerTime ?? session?.totalElapsedTime ?? spanSeconds;
  return computeTss(durationSec, np, ftp.watts);
}
