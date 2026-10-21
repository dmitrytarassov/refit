import type { RepeatBlock, WorkoutBlock } from "../types/repeat-block";
import type { StepRef } from "../types/step-ref";
import type { WorkoutStep } from "../types/workout-step";

export function updateStepAt(
  blocks: WorkoutBlock[],
  ref: StepRef,
  patch: Partial<WorkoutStep>,
): WorkoutBlock[] {
  return blocks.map((block, i) => {
    if (i !== ref.index) {
      return block;
    }
    if (block.kind === "repeat") {
      return {
        ...block,
        steps: block.steps.map((step, j) =>
          j === ref.child ? { ...step, ...patch } : step,
        ),
      };
    }
    return ref.child == null ? { ...block, ...patch } : block;
  });
}

export function updateRepeatAt(
  blocks: WorkoutBlock[],
  index: number,
  patch: Partial<Pick<RepeatBlock, "times" | "skipLast">>,
): WorkoutBlock[] {
  return blocks.map((block, i) =>
    i === index && block.kind === "repeat" ? { ...block, ...patch } : block,
  );
}
