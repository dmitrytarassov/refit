import type { TirePressure } from "./tire-pressure";

/** Multiplier on Crr: harder tires roll easier (on smooth surfaces). */
export const PRESSURE_FACTOR: Record<TirePressure, number> = {
  high: 0.9,
  medium: 1.0,
  low: 1.2,
};
