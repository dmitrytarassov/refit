import type { WorkoutBlock } from "../types/repeat-block";

/** A planned workout in the `workouts` store; the metrics are precomputed for the list. */
export interface WorkoutRow {
  id?: number;
  name: string;
  createdAt: number;
  updatedAt: number;
  /** FTP the fractions were edited against, restored with the workout. */
  ftp: number;
  durationSec: number;
  tss: number;
  blocks: WorkoutBlock[];
}
