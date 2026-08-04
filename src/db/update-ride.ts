import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";
import type { RideRow } from "./ride-row";

export async function updateRide(row: RideRow): Promise<void> {
  const db = await openRidesDb();
  const store = db.transaction("rides", "readwrite").objectStore("rides");
  await idbRequest(store.put(row));
  db.close();
}
