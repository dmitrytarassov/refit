import { usePowerCurve } from "./use-power-curve";

import { estimateFtp } from "../../lib/power/estimate-ftp";
import type { FtpEstimate } from "../../lib/power/ftp-estimate";
import type { Activity } from "../types/activity";

export function useFTP(activity: Activity): FtpEstimate | null {
  return estimateFtp(usePowerCurve(activity));
}
