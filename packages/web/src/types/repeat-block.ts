import type { WorkoutStep } from "./workout-step";

/** A group of steps ridden `times` times in a row. */
export interface RepeatBlock {
  kind: "repeat";
  times: number;
  /** Drop the last step of the final repetition (a rest that would run into the cool-down). */
  skipLast: boolean;
  steps: WorkoutStep[];
}

export type WorkoutBlock = WorkoutStep | RepeatBlock;
