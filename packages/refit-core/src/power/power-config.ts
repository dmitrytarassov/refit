import type { CdaSelector } from "./cda-selector.js";
import type { MassConfig } from "./mass-config.js";
import type { RollingResistance } from "./rolling-resistance.js";

export interface PowerConfig {
  mass: MassConfig;
  cda: CdaSelector;
  crr: RollingResistance;
  /** Chain + bearings loss; defaults to DEFAULT_DRIVETRAIN_EFFICIENCY. */
  drivetrainEfficiency?: number;
}
