import type { MassConfig } from "./mass-config";

export function totalMassKg(mass: MassConfig): number {
  return mass.bikeKg + mass.riderKg;
}
