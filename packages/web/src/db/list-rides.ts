import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";
import type { RideRow } from "./ride-row";

export async function listRides(): Promise<Array<Omit<RideRow, "file">>> {
  const db = await openRidesDb();
  const store = db.transaction("rides", "readonly").objectStore("rides");
  const rows = (await idbRequest(store.getAll())) as RideRow[];
  db.close();
  return rows
    .map(({ file, ...summary }) => {
      void file;
      return summary;
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}
