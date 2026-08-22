import { normalizedPowerW } from "./normalized.js";
import type { SessionPowerStats } from "./session-power-stats.js";

import type { FitRecord } from "../track/fit-record.js";

export function sessionPowerStats(
  records: FitRecord[],
  powers: Array<number | undefined>,
): SessionPowerStats | null {
  const samples: Array<{ t: number; p: number }> = [];
  records.forEach((r, i) => {
    const p = powers[i];
    if (p != null && r.timestamp) {
      samples.push({ t: r.timestamp.getTime() / 1000, p });
    }
  });
  if (samples.length === 0) {
    return null;
  }

  const avg = samples.reduce((s, x) => s + x.p, 0) / samples.length;
  const max = samples.reduce((m, x) => Math.max(m, x.p), 0);
  const np = normalizedPowerW(samples);
  return {
    avgPower: Math.round(avg),
    maxPower: max,
    ...(np != null ? { normalizedPower: Math.round(np) } : {}),
  };
}
