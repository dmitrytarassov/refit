import type { HampelConfig } from "./hampel-config.js";

export const DEFAULT_HAMPEL: HampelConfig = {
  windowHalf: 5,
  nSigmas: 6,
  minSigmaMps: 1,
};
