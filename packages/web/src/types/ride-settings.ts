import type { MassConfig, RiderPosition, RollingResistance } from "refit-core";

export interface RideSettings {
  /** The app offers the presets only; the library also accepts a measured CdA or a ladder. */
  cda: RiderPosition | "auto";
  crr: RollingResistance;
  mass?: MassConfig;
}
