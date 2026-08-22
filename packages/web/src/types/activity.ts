import type { CleanResult, FitRecord, SessionPowerStats } from "refit-core";
import type { FitFile } from "refit-core/fit";

import type { RideSettings } from "./ride-settings";

export interface Activity {
  fileName: string;
  title?: string;
  fit: FitFile;
  records: FitRecord[];
  verdicts: CleanResult["verdicts"];
  report: CleanResult["report"];
  powers: Array<number | undefined>;
  powerStats: SessionPowerStats | null;
  settings: RideSettings;
}
