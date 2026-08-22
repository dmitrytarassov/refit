import type { RiderPosition } from "./rider-position.js";

/** Effective frontal area x drag coefficient, m^2, typical road values. */
export const CDA_BY_POSITION: Record<RiderPosition, number> = {
  tops: 0.4,
  hoods: 0.32,
  drops: 0.28,
  aero: 0.23,
};
