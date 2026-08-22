import type { Verdict } from "./verdict.js";

import type { SessionPowerStats } from "../power/session-power-stats.js";

export interface EnhancementOptions {
  verdicts: Map<number, Verdict>;
  smooth: boolean;
  powers: Array<number | undefined> | null;
  powerStats: SessionPowerStats | null;
}
