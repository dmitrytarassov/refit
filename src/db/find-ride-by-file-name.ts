import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";
import type { RideRow } from "./ride-row";

export async function findRideByFileName(
  fileName: string,
): Promise<RideRow | undefined> {
  const db = await openRidesDb();
  const store = db.transaction("rides", "readonly").objectStore("rides");
  const row = (await idbRequest(store.index("fileName").get(fileName))) as
    RideRow | undefined;
  db.close();
  return row;
}
