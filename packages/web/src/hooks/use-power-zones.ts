import { computePowerZones, type ZoneTime } from "refit-core";

import { useFTP } from "./use-ftp";

import type { Activity } from "../types/activity";

export function usePowerZones(activity: Activity): ZoneTime[] {
  const ftp = useFTP(activity);
  if (ftp == null) {
    return [];
  }
  return computePowerZones(activity.records, activity.powers, ftp.watts);
}
