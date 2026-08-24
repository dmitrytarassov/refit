import type { RideSettings } from "../types/ride-settings";

export const POWER_DEFAULTS: Required<RideSettings> = {
  mass: { bikeKg: 8, riderKg: 82, gearKg: 2 },
  cda: "auto",
  crr: { surface: "good-asphalt", tires: "road", pressure: "high" },
};
