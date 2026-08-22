import { CRR_BY_SURFACE } from "./crr-by-surface.js";
import { PRESSURE_FACTOR } from "./pressure-factor.js";
import type { RollingResistance } from "./rolling-resistance.js";
import { TIRE_FACTOR } from "./tire-factor.js";

export function resolveCrr(rr: RollingResistance): number {
  return (
    CRR_BY_SURFACE[rr.surface] *
    TIRE_FACTOR[rr.tires] *
    PRESSURE_FACTOR[rr.pressure]
  );
}
