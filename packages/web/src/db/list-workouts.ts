import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";
import type { WorkoutRow } from "./workout-row";

/** All saved workouts, newest first. */
export async function listWorkouts(): Promise<WorkoutRow[]> {
  const db = await openRidesDb();
  const store = db.transaction("workouts", "readonly").objectStore("workouts");
  const rows = (await idbRequest(store.getAll())) as WorkoutRow[];
  db.close();
  return rows.sort((a, b) => b.updatedAt - a.updatedAt);
}
