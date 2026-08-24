import type { AutoCdaConfig } from "./auto-cda-config.js";

/** Default full width of the blend band: 4 km/h. */
export const DEFAULT_AUTO_BLEND_MPS = 4 / 3.6;

/** What `"auto"` means: a road bike on a drop bar, the 0.1.x threshold, blended. */
export const DEFAULT_AUTO_CDA: AutoCdaConfig = {
  steps: [{ position: "hoods", upToMps: 33 / 3.6 }, { position: "drops" }],
  blendBandMps: DEFAULT_AUTO_BLEND_MPS,
};
