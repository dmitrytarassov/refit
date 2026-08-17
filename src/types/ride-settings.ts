import type { CdaSelector } from "../../lib/power/cda-selector";
import type { MassConfig } from "../../lib/power/mass-config";
import type { RollingResistance } from "../../lib/power/rolling-resistance";

export interface RideSettings {
  cda: CdaSelector;
  crr: RollingResistance;
  mass?: MassConfig;
}
