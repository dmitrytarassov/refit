import type { PowerConfig } from "../../lib/power/power-config";

export const POWER_DEFAULTS: PowerConfig = {
  mass: { bikeKg: 8, riderKg: 81 },
  cda: "auto",
  crr: { surface: "good-asphalt", tires: "road", pressure: "high" },
};
