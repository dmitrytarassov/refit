import type { WorkoutBlock } from "./repeat-block";

export interface Workout {
  name: string;
  blocks: WorkoutBlock[];
}
