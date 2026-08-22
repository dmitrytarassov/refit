import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";
import type { RideRow } from "./ride-row";

export async function saveRide(row: Omit<RideRow, "id">): Promise<number> {
  const db = await openRidesDb();
  const store = db.transaction("rides", "readwrite").objectStore("rides");
  const key = await idbRequest(store.add(row));
  db.close();
  return key as number;
}
