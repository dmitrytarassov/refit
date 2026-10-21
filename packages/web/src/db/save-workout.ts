import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";
import type { WorkoutRow } from "./workout-row";

/** Adds a row without an id, overwrites one with it; returns the key. */
export async function saveWorkout(row: WorkoutRow): Promise<number> {
  const db = await openRidesDb();
  const store = db.transaction("workouts", "readwrite").objectStore("workouts");
  const key = await idbRequest(store.put(row));
  db.close();
  return key as number;
}
