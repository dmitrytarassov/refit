import { estimateFtp } from "refit-core";

import { useManualFtp } from "./use-manual-ftp";
import { usePowerCurve } from "./use-power-curve";

import type { Activity } from "../types/activity";
import type { RideFtp } from "../types/ride-ftp";

/** The single place deciding which FTP the app runs on: manual wins. */
export function useFTP(activity: Activity): RideFtp | null {
  const { ftp: manual } = useManualFtp();
  const estimate = estimateFtp(usePowerCurve(activity));
  if (manual != null) {
    return { watts: manual, source: "manual" };
  }
  if (estimate != null) {
    return {
      watts: estimate.watts,
      source: "estimated",
      method: estimate.method,
    };
  }
  return null;
}
