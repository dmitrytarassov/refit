import type { WorkoutBlock } from "../types/repeat-block";
import type { StepRef } from "../types/step-ref";
import type { WorkoutStep } from "../types/workout-step";

/** The plain step a ref points at; undefined for a repeat block itself or a stale ref. */
export function stepAt(
  blocks: WorkoutBlock[],
  ref: StepRef,
): WorkoutStep | undefined {
  const block = blocks[ref.index];
  if (block == null) {
    return undefined;
  }
  if (block.kind === "repeat") {
    return ref.child == null ? undefined : block.steps[ref.child];
  }
  return ref.child == null ? block : undefined;
}
