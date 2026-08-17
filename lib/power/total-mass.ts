import { DEFAULT_GEAR_KG } from "./gear-defaults";
import type { MassConfig } from "./mass-config";

export function totalMassKg(mass: MassConfig): number {
  const bottlesKg =
    (mass.bottlesMl ?? []).reduce((sum, ml) => sum + ml, 0) / 1000;
  return (
    mass.bikeKg + mass.riderKg + (mass.gearKg ?? DEFAULT_GEAR_KG) + bottlesKg
  );
}
