import type { WorkoutBlock } from "../types/repeat-block";
import type { StepRef } from "../types/step-ref";

/** Drops the top-level block, or the one step inside a repeat, the ref points at. */
export function removeBlockAt(
  blocks: WorkoutBlock[],
  ref: StepRef,
): WorkoutBlock[] {
  if (ref.child == null) {
    return blocks.filter((_, i) => i !== ref.index);
  }
  return blocks.map((block, i) =>
    i === ref.index && block.kind === "repeat"
      ? { ...block, steps: block.steps.filter((_, j) => j !== ref.child) }
      : block,
  );
}
