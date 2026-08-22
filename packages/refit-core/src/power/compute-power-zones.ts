import { COGGAN_ZONE_UPPER_FRACTIONS } from "./zone-bounds.js";
import type { ZoneTime } from "./zone-time.js";

import type { FitRecord } from "../track/fit-record.js";

export function computePowerZones(
  records: FitRecord[],
  powers: Array<number | undefined>,
  ftp: number,
): ZoneTime[] {
  const seconds = COGGAN_ZONE_UPPER_FRACTIONS.map(() => 0);
  for (let i = 0; i < records.length - 1; i++) {
    const t0 = records[i].timestamp?.getTime();
    const t1 = records[i + 1].timestamp?.getTime();
    if (t0 == null || t1 == null) {
      continue;
    }
    const dt = (t1 - t0) / 1000;
    if (dt <= 0 || dt > 10) {
      continue;
    }
    const power = records[i].power ?? powers[i];
    if (power == null) {
      continue;
    }
    const zone = COGGAN_ZONE_UPPER_FRACTIONS.findIndex((f) => power <= f * ftp);
    seconds[zone] += dt;
  }
  const total = seconds.reduce((sum, s) => sum + s, 0);
  return seconds.map((s, i) => ({
    zone: `Z${i + 1}`,
    seconds: Math.round(s),
    fraction: total > 0 ? s / total : 0,
  }));
}
