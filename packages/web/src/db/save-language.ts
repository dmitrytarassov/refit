import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";

import type { Language } from "../types/language";

export async function saveLanguage(language: Language): Promise<void> {
  const db = await openRidesDb();
  const store = db.transaction("settings", "readwrite").objectStore("settings");
  await idbRequest(store.put(language, "language"));
  db.close();
}
