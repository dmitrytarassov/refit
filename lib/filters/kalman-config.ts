/**
 * 2D constant-velocity Kalman filter with innovation (Mahalanobis) gating,
 * followed by a Rauch-Tung-Striebel smoother — this is offline processing, so
 * every estimate can use the whole track, not just the past.
 *
 * State: [x, y, vx, vy]. Measurements: GPS position only.
 */
export interface KalmanConfig {
  /** Process noise: white acceleration sigma, m/s^2. Higher = trusts measurements more. */
  accelSigmaMps2: number;
  /** GPS position noise sigma, m. */
  gpsSigmaM: number;
  /** Chi-squared gate for 2 DoF. 13.82 ~ 99.9% of honest fixes pass. */
  gateChi2: number;
  /** Rejections in a row before re-initializing at the measurement. */
  maxConsecutiveRejects: number;
  /** Time gap, s, after which the filter re-initializes instead of predicting across. */
  gapResetS: number;
  /** Initial velocity sigma, m/s (velocity is unobserved at segment start). */
  initVelocitySigmaMps: number;
}
