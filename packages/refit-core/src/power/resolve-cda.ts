import type { AutoCdaConfig } from "./auto-cda-config.js";
import { DEFAULT_AUTO_CDA } from "./auto-cda-defaults.js";
import { CDA_BY_POSITION } from "./cda-by-position.js";
import type { CdaSelector } from "./cda-selector.js";

export function resolveCda(selector: CdaSelector, speedMps: number): number {
  if (typeof selector === "number") {
    return selector;
  }
  if (typeof selector === "string" && selector !== "auto") {
    return CDA_BY_POSITION[selector];
  }

  const cfg: AutoCdaConfig = selector === "auto" ? DEFAULT_AUTO_CDA : selector;
  const { steps, blendBandMps } = cfg;

  let i = steps.findIndex(
    (s) => s.upToMps === undefined || speedMps <= s.upToMps,
  );
  if (i === -1) {
    i = steps.length - 1;
  }

  const here = CDA_BY_POSITION[steps[i].position];
  if (blendBandMps <= 0) {
    return here;
  }

  // Blending is symmetric around a boundary: half of the band sits in each
  // step, so both sides reach the same midpoint value and power stays
  // continuous across the boundary.
  const half = blendBandMps / 2;
  const upper = steps[i].upToMps;
  const lower = i > 0 ? steps[i - 1].upToMps : undefined;

  if (upper !== undefined && speedMps > upper - half) {
    const next = CDA_BY_POSITION[steps[i + 1].position];
    const t = (speedMps - (upper - half)) / blendBandMps;
    return here + (next - here) * Math.min(1, Math.max(0, t));
  }
  if (lower !== undefined && speedMps < lower + half) {
    const prev = CDA_BY_POSITION[steps[i - 1].position];
    const t = (speedMps - (lower - half)) / blendBandMps;
    return prev + (here - prev) * Math.min(1, Math.max(0, t));
  }
  return here;
}
