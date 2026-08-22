import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";

export async function saveManualFtp(value: number | null): Promise<void> {
  const db = await openRidesDb();
  const store = db.transaction("settings", "readwrite").objectStore("settings");
  await (value == null
    ? idbRequest(store.delete("ftp"))
    : idbRequest(store.put(value, "ftp")));
  db.close();
}
