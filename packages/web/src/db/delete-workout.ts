import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";

export async function deleteWorkout(id: number): Promise<void> {
  const db = await openRidesDb();
  const store = db.transaction("workouts", "readwrite").objectStore("workouts");
  await idbRequest(store.delete(id));
  db.close();
}
