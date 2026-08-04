import type { PipelineConfig } from "./pipeline-config";

import { DEFAULT_HAMPEL } from "../filters/hampel-defaults";
import { DEFAULT_KALMAN } from "../filters/kalman-defaults";
import { DEFAULT_SPEED_GATE } from "../filters/speed-gate-defaults";

export const DEFAULT_PIPELINE: PipelineConfig = {
  speedGate: DEFAULT_SPEED_GATE,
  hampel: DEFAULT_HAMPEL,
  kalman: DEFAULT_KALMAN,
};
