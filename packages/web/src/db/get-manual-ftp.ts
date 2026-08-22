import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";

export async function getManualFtp(): Promise<number | null> {
  const db = await openRidesDb();
  const store = db.transaction("settings", "readonly").objectStore("settings");
  const stored = (await idbRequest(store.get("ftp"))) as number | undefined;
  db.close();
  return stored ?? null;
}
