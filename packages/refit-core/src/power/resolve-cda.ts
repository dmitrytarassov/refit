import { CDA_BY_POSITION } from "./cda-by-position.js";
import type { CdaSelector } from "./cda-selector.js";

export function resolveCda(selector: CdaSelector, speedMps: number): number {
  if (selector === "auto") {
    const autoThresholdMps = 33 / 3.6;
    return speedMps > autoThresholdMps
      ? CDA_BY_POSITION.drops
      : CDA_BY_POSITION.hoods;
  }
  return CDA_BY_POSITION[selector];
}
