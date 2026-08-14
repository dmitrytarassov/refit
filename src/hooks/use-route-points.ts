import { routePoints } from "../fit/route-points";
import type { Activity } from "../types/activity";

export function useRoutePoints(
  activity: Activity,
  original = false,
): Array<[number, number]> {
  return routePoints(activity, original);
}
