import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";

import type { MassConfig } from "../../lib/power/mass-config";

export async function saveMassSettings(
  value: MassConfig | null,
): Promise<void> {
  const db = await openRidesDb();
  const store = db.transaction("settings", "readwrite").objectStore("settings");
  await (value == null
    ? idbRequest(store.delete("mass"))
    : idbRequest(store.put(value, "mass")));
  db.close();
}
