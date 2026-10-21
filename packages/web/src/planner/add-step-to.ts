import type { WorkoutBlock } from "../types/repeat-block";
import type { StepRef } from "../types/step-ref";
import type { WorkoutStep } from "../types/workout-step";

/**
 * Appends a step inside the repeat block the selection sits in (the repeat
 * itself or one of its steps); otherwise to the end of the timeline.
 */
export function addStepTo(
  blocks: WorkoutBlock[],
  selected: StepRef | null,
  step: WorkoutStep,
): WorkoutBlock[] {
  const target = selected == null ? undefined : blocks[selected.index];
  if (target?.kind !== "repeat") {
    return [...blocks, step];
  }
  return blocks.map((block, i) =>
    i === selected?.index && block.kind === "repeat"
      ? { ...block, steps: [...block.steps, step] }
      : block,
  );
}
