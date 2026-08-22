import type { HampelConfig } from "../filters/hampel-config.js";
import type { KalmanConfig } from "../filters/kalman-config.js";
import type { SpeedGateConfig } from "../filters/speed-gate-config.js";

/**
 * Cleaning pipeline, cheapest to smartest; each stage sees only the points
 * that survived the previous ones, and each can be disabled independently:
 *
 * 1. speed-gate — gross outliers vs device-reported speed
 * 2. hampel    — robust local statistics (rolling median + MAD), no trusted speed needed
 * 3. kalman    — motion-model gating + RTS smoothing over the whole track
 */
export interface PipelineConfig {
  speedGate: SpeedGateConfig | false;
  hampel: HampelConfig | false;
  kalman: KalmanConfig | false;
}
