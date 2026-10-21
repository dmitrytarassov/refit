import { captionLevels } from "../planner/caption-levels";
import { expandBlocks } from "../planner/expand-blocks";
import { axisSeconds, axisTickStep } from "../planner/planner-axis";
import { stepCaptions } from "../planner/step-captions";
import { workoutSeconds } from "../planner/workout-totals";
import type { Workout } from "../types/workout";
import type { WorkoutCaption } from "../types/workout-caption";

/** Geometry of the planner chart: axis length, tick spacing, Y ceiling (Z6 plus headroom, or the peak), note markers with their rows. */
export function useWorkoutChart(workout: Workout): {
  totalSeconds: number;
  axis: number;
  tickStep: number;
  yMax: number;
  captions: WorkoutCaption[];
  levels: number[];
} {
  const totalSeconds = workoutSeconds(workout.blocks);
  const axis = axisSeconds(totalSeconds);
  const peak = expandBlocks(workout.blocks).reduce(
    (max, step) => Math.max(max, step.from, step.to),
    0,
  );
  const captions = stepCaptions(workout.blocks);
  return {
    totalSeconds,
    axis,
    tickStep: axisTickStep(axis),
    yMax: Math.max(1.35, peak + 0.1),
    captions,
    levels: captionLevels(captions, axis),
  };
}
