import { DEFAULT_GEAR_KG } from "./gear-defaults.js";
import type { MassConfig } from "./mass-config.js";

export function totalMassKg(mass: MassConfig): number {
  const bottlesKg =
    (mass.bottlesMl ?? []).reduce((sum, ml) => sum + ml, 0) / 1000;
  return (
    mass.bikeKg + mass.riderKg + (mass.gearKg ?? DEFAULT_GEAR_KG) + bottlesKg
  );
}
