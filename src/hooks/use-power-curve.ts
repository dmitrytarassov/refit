import type { CurvePoint } from "../../lib/power/curve-point";
import { powerCurve } from "../../lib/power/power-curve";
import type { Activity } from "../types/activity";

export function usePowerCurve(activity: Activity): CurvePoint[] {
  return powerCurve(activity.records, activity.powers);
}
