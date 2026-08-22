import type { SpeedGateConfig } from "./speed-gate-config.js";

export const DEFAULT_SPEED_GATE: SpeedGateConfig = {
  toleranceFactor: 2,
  minThresholdM: 10,
  fallbackSpeedMps: 10,
  maxPlausibleSpeedMps: 30,
};
