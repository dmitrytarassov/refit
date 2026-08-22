import type { CdaSelector, MassConfig, RollingResistance } from "refit-core";

export interface RideSettings {
  cda: CdaSelector;
  crr: RollingResistance;
  mass?: MassConfig;
}
