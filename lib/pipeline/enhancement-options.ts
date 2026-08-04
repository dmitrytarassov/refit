import type { Verdict } from "./verdict";

import type { SessionPowerStats } from "../power/session-power-stats";

export interface EnhancementOptions {
  verdicts: Map<number, Verdict>;
  smooth: boolean;
  powers: Array<number | undefined> | null;
  powerStats: SessionPowerStats | null;
}
