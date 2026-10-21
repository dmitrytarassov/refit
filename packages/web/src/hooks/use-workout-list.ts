import { useEffect, useState } from "react";

import { deleteWorkout } from "../db/delete-workout";
import { listWorkouts } from "../db/list-workouts";
import type { WorkoutRow } from "../db/workout-row";

/** Saved workouts for the list page + optimistic delete. */
export function useWorkoutList(): {
  workouts: WorkoutRow[];
  loading: boolean;
  remove: (id: number) => void;
} {
  const [workouts, setWorkouts] = useState<WorkoutRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listWorkouts()
      .then(setWorkouts)
      .finally(() => setLoading(false));
  }, []);

  const remove = (id: number): void => {
    setWorkouts((current) => current.filter((row) => row.id !== id));
    void deleteWorkout(id);
  };

  return { workouts, loading, remove };
}
