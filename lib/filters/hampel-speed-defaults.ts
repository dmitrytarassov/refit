import type { HampelConfig } from "./hampel-config";

/**
 * Tighter than the GPS Hampel: device speed on a steady ride varies little
 * within an 11-record window, and a real 1-s sprint surge (~+2 m/s) must
 * survive while a recording glitch (+5 m/s and more) gets replaced.
 */
export const HAMPEL_SPEED_DEFAULTS: HampelConfig = {
  windowHalf: 5,
  nSigmas: 5,
  minSigmaMps: 0.5,
};
