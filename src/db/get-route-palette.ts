import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";

import { ROUTE_PALETTE_KEYS } from "../route/route-palettes";
import type { RoutePaletteKey } from "../types/route-palette";

/** The saved route color palette key; null when absent or unknown. */
export async function getRoutePalette(): Promise<RoutePaletteKey | null> {
  const db = await openRidesDb();
  const store = db.transaction("settings", "readonly").objectStore("settings");
  const stored = await idbRequest(store.get("routePalette"));
  db.close();
  return ROUTE_PALETTE_KEYS.find((key) => key === stored) ?? null;
}
