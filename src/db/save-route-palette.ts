import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";

import type { RoutePaletteKey } from "../types/route-palette";

export async function saveRoutePalette(key: RoutePaletteKey): Promise<void> {
  const db = await openRidesDb();
  const store = db.transaction("settings", "readwrite").objectStore("settings");
  await idbRequest(store.put(key, "routePalette"));
  db.close();
}
