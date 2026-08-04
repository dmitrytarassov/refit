import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";

import { POWER_DEFAULTS } from "../fit/power-defaults";
import type { RideSettings } from "../types/ride-settings";

export async function getLastSettings(): Promise<RideSettings> {
  const db = await openRidesDb();
  const store = db.transaction("settings", "readonly").objectStore("settings");
  const stored = (await idbRequest(store.get("power"))) as
    RideSettings | undefined;
  db.close();
  return stored ?? { cda: POWER_DEFAULTS.cda, crr: POWER_DEFAULTS.crr };
}
