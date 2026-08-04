import type { RideSettings } from "./ride-settings";

import type { FitFile } from "../../lib/fit/ordered-mesg";
import type { CleanResult } from "../../lib/pipeline/verdict";
import type { SessionPowerStats } from "../../lib/power/session-power-stats";
import type { FitRecord } from "../../lib/track/fit-record";

export interface Activity {
  fileName: string;
  fit: FitFile;
  records: FitRecord[];
  verdicts: CleanResult["verdicts"];
  report: CleanResult["report"];
  powers: Array<number | undefined>;
  powerStats: SessionPowerStats | null;
  settings: RideSettings;
}
