import type { PowerConfig } from "../../lib/power/power-config";

export const POWER_DEFAULTS: PowerConfig = {
  mass: { bikeKg: 8, riderKg: 82, gearKg: 2 },
  cda: "auto",
  crr: { surface: "good-asphalt", tires: "road", pressure: "high" },
};
