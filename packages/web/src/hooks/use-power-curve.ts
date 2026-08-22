import { type CurvePoint, powerCurve } from "refit-core";

import type { Activity } from "../types/activity";

export function usePowerCurve(activity: Activity): CurvePoint[] {
  return powerCurve(activity.records, activity.powers);
}
