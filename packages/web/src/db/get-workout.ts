import { idbRequest } from "./idb-request";
import { openRidesDb } from "./open-rides-db";
import type { WorkoutRow } from "./workout-row";

export async function getWorkout(id: number): Promise<WorkoutRow | undefined> {
  const db = await openRidesDb();
  const store = db.transaction("workouts", "readonly").objectStore("workouts");
  const row = (await idbRequest(store.get(id))) as WorkoutRow | undefined;
  db.close();
  return row;
}
