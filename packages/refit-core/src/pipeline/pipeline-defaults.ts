import type { PipelineConfig } from "./pipeline-config.js";

import { DEFAULT_HAMPEL } from "../filters/hampel-defaults.js";
import { DEFAULT_KALMAN } from "../filters/kalman-defaults.js";
import { DEFAULT_SPEED_GATE } from "../filters/speed-gate-defaults.js";

export const DEFAULT_PIPELINE: PipelineConfig = {
  speedGate: DEFAULT_SPEED_GATE,
  hampel: DEFAULT_HAMPEL,
  kalman: DEFAULT_KALMAN,
};
