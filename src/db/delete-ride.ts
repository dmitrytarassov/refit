import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";

export async function deleteRide(id: number): Promise<void> {
  const db = await openRidesDb();
  const store = db.transaction("rides", "readwrite").objectStore("rides");
  await idbRequest(store.delete(id));
  db.close();
}
