/**
 * Speed gate: a point is an outlier if it is farther from the last *accepted*
 * point than the device-reported speed allows for the elapsed time (with a
 * tolerance factor and a noise floor). Comparing against the last accepted
 * point — with a threshold that grows with accumulated dt — makes the gate
 * robust to runs of consecutive outliers.
 */
export interface SpeedGateConfig {
  /** Multiplier on speed * dt (GPS noise, speed quantization). */
  toleranceFactor: number;
  /** Minimum threshold in meters, so slow/stationary segments are not over-flagged. */
  minThresholdM: number;
  /** Used when the device reports no speed, m/s. */
  fallbackSpeedMps: number;
  /** Cap on reported speed, m/s — guards against speed spikes caused by the same GPS glitch. */
  maxPlausibleSpeedMps: number;
}
