import type { HampelConfig } from "./hampel-config";

export const DEFAULT_HAMPEL: HampelConfig = {
  windowHalf: 5,
  nSigmas: 6,
  minSigmaMps: 1,
};
