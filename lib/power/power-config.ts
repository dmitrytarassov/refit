import type { CdaSelector } from "./cda-selector";
import type { MassConfig } from "./mass-config";
import type { RollingResistance } from "./rolling-resistance";

export interface PowerConfig {
  mass: MassConfig;
  cda: CdaSelector;
  crr: RollingResistance;
  /** Chain + bearings loss; defaults to DEFAULT_DRIVETRAIN_EFFICIENCY. */
  drivetrainEfficiency?: number;
}
