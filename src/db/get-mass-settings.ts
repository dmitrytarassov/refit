import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";

import type { MassConfig } from "../../lib/power/mass-config";

export async function getMassSettings(): Promise<MassConfig | null> {
  const db = await openRidesDb();
  const store = db.transaction("settings", "readonly").objectStore("settings");
  const stored = (await idbRequest(store.get("mass"))) as
    MassConfig | undefined;
  db.close();
  return stored ?? null;
}
