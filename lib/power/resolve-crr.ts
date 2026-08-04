import { CRR_BY_SURFACE } from "./crr-by-surface";
import { PRESSURE_FACTOR } from "./pressure-factor";
import type { RollingResistance } from "./rolling-resistance";
import { TIRE_FACTOR } from "./tire-factor";

export function resolveCrr(rr: RollingResistance): number {
  return (
    CRR_BY_SURFACE[rr.surface] *
    TIRE_FACTOR[rr.tires] *
    PRESSURE_FACTOR[rr.pressure]
  );
}
