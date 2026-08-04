import { useFTP } from "./use-ftp";

import { computePowerZones } from "../../lib/power/compute-power-zones";
import type { ZoneTime } from "../../lib/power/zone-time";
import type { Activity } from "../types/activity";

export function usePowerZones(activity: Activity): ZoneTime[] {
  const ftp = useFTP(activity);
  if (ftp == null) {
    return [];
  }
  return computePowerZones(activity.records, activity.powers, ftp.watts);
}
