import type { RepeatBlock, WorkoutBlock } from "../types/repeat-block";
import type { WorkoutStep } from "../types/workout-step";

/** The steps a repeat block rides, in order, each tagged with the index of the step it copies. */
export function expandRepeat(
  block: RepeatBlock,
): Array<{ step: WorkoutStep; child: number }> {
  const copies: Array<{ step: WorkoutStep; child: number }> = [];
  for (let rep = 0; rep < block.times; rep++) {
    block.steps.forEach((step, child) => {
      const last = rep === block.times - 1 && child === block.steps.length - 1;
      if (!(last && block.skipLast)) {
        copies.push({ step, child });
      }
    });
  }
  return copies;
}

/** The whole timeline as plain steps, repeats unrolled. */
export function expandBlocks(blocks: WorkoutBlock[]): WorkoutStep[] {
  return blocks.flatMap((block) =>
    block.kind === "repeat"
      ? expandRepeat(block).map((copy) => copy.step)
      : [block],
  );
}
