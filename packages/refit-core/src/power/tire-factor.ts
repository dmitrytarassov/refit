import type { TireType } from "./tire-type.js";

/** Multiplier on the surface base Crr. */
export const TIRE_FACTOR: Record<TireType, number> = {
  road: 1.0,
  endurance: 1.1,
  gravel: 1.25,
  mtb: 1.5,
};
