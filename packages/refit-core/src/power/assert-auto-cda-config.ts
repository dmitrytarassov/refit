import type { AutoCdaConfig } from "./auto-cda-config.js";
import { CDA_BY_POSITION } from "./cda-by-position.js";
import { minBlendBandMps } from "./min-blend-band.js";

/**
 * Validates a ladder once, before a ride is processed — `resolveCda` runs per
 * record and cannot afford this. Throws on anything that would make the model
 * silently wrong, including a blend band too narrow to keep power monotonic.
 */
export function assertAutoCdaConfig(cfg: AutoCdaConfig): void {
  const { steps, blendBandMps } = cfg;
  if (steps.length < 1) {
    throw new Error("AutoCdaConfig: steps must not be empty");
  }
  if (!(blendBandMps >= 0) || !Number.isFinite(blendBandMps)) {
    throw new Error("AutoCdaConfig: blendBandMps must be a finite number >= 0");
  }

  steps.forEach((step, i) => {
    const last = i === steps.length - 1;
    if (last && step.upToMps !== undefined) {
      throw new Error(
        `AutoCdaConfig: step ${i} is last and must have no upToMps (it is open-ended)`,
      );
    }
    if (!last && !(typeof step.upToMps === "number" && step.upToMps > 0)) {
      throw new Error(`AutoCdaConfig: step ${i} needs upToMps > 0`);
    }
    const previous = i > 0 ? steps[i - 1].upToMps : undefined;
    const bound = step.upToMps ?? Infinity;
    if (!last && previous !== undefined && bound <= previous) {
      throw new Error(
        `AutoCdaConfig: step ${i} upToMps must be greater than step ${i - 1}`,
      );
    }
  });

  if (blendBandMps === 0) {
    return;
  }

  steps.forEach((step, i) => {
    const boundary = step.upToMps;
    if (boundary === undefined) {
      return;
    }
    const previous = i > 0 ? steps[i - 1].upToMps : undefined;
    if (previous !== undefined && blendBandMps >= boundary - previous) {
      throw new Error(
        `AutoCdaConfig: blendBandMps ${blendBandMps} overlaps the neighbouring boundary at step ${i}; it must be narrower than the ${boundary - previous} m/s gap`,
      );
    }
    const needed = minBlendBandMps(
      CDA_BY_POSITION[step.position],
      CDA_BY_POSITION[steps[i + 1].position],
      boundary,
    );
    if (blendBandMps < needed) {
      throw new Error(
        `AutoCdaConfig: blendBandMps ${blendBandMps} is too narrow for the ${step.position} -> ${steps[i + 1].position} boundary at ${boundary} m/s — power would fall as speed rises; use at least ${needed} m/s or set blendBandMps to 0 to keep the hard switch`,
      );
    }
  });
}
