import type { KalmanConfig } from "./kalman-config";

export const DEFAULT_KALMAN: KalmanConfig = {
  accelSigmaMps2: 1.0,
  gpsSigmaM: 6,
  gateChi2: 13.82,
  maxConsecutiveRejects: 5,
  gapResetS: 60,
  initVelocitySigmaMps: 15,
};
