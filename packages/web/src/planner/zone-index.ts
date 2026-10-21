import { ZONE_TARGETS } from "./planner-zones";

/** Zone number (1..6) of a target given as a fraction of FTP. */
export function zoneIndex(fraction: number): number {
  return (
    ZONE_TARGETS.filter((lower, i) => i > 0 && fraction >= lower).length + 1
  );
}
