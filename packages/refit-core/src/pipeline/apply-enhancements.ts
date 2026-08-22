import type { EnhancementOptions } from "./enhancement-options.js";

import { RECORD_MESG_NUM, SESSION_MESG_NUM } from "../fit/mesg-nums.js";
import type { OrderedMesg } from "../fit/ordered-mesg.js";
import { degToSemicircles } from "../geo/semicircles.js";

export function applyEnhancements(
  ordered: OrderedMesg[],
  opts: EnhancementOptions,
): void {
  let recordIndex = -1;
  for (const { mesgNum, mesg } of ordered) {
    if (mesgNum === RECORD_MESG_NUM) {
      recordIndex++;
      const verdict = opts.verdicts.get(recordIndex);
      if (verdict?.status === "rejected") {
        // The rest of the record (heart rate, cadence, ...) is valid — only the fix is bad.
        delete mesg.positionLat;
        delete mesg.positionLong;
      } else if (opts.smooth && verdict?.smoothed) {
        mesg.positionLat = degToSemicircles(verdict.smoothed.latDeg);
        mesg.positionLong = degToSemicircles(verdict.smoothed.lonDeg);
      }
      const p = opts.powers?.[recordIndex];
      if (p != null) {
        mesg.power = p;
      }
    } else if (mesgNum === SESSION_MESG_NUM && opts.powerStats) {
      mesg.avgPower = opts.powerStats.avgPower;
      mesg.maxPower = opts.powerStats.maxPower;
      if (opts.powerStats.normalizedPower != null) {
        mesg.normalizedPower = opts.powerStats.normalizedPower;
      }
    }
  }
}
