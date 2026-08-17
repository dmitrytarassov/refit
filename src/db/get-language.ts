import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";

import type { Language } from "../types/language";

export async function getLanguage(): Promise<Language | null> {
  const db = await openRidesDb();
  const store = db.transaction("settings", "readonly").objectStore("settings");
  const stored = (await idbRequest(store.get("language"))) as
    Language | undefined;
  db.close();
  return stored ?? null;
}
