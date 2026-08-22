import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";

import type { RideSettings } from "../types/ride-settings";

export async function saveLastSettings(settings: RideSettings): Promise<void> {
  const db = await openRidesDb();
  const store = db.transaction("settings", "readwrite").objectStore("settings");
  await idbRequest(store.put(settings, "power"));
  db.close();
}
