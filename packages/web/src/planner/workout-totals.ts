import { expandBlocks } from "./expand-blocks";
import { repeatSeconds } from "./repeat-seconds";

import type { WorkoutBlock } from "../types/repeat-block";

export function workoutSeconds(blocks: WorkoutBlock[]): number {
  return blocks.reduce(
    (sum, block) =>
      sum + (block.kind === "repeat" ? repeatSeconds(block) : block.seconds),
    0,
  );
}

/**
 * Planned TSS over the unrolled timeline: sec · IF² / 36 per step, where IF
 * is the target as a fraction of FTP. A ramp integrates IF² over its linear
 * slope — (a² + ab + b²) / 3; free ride adds nothing.
 */
export function workoutTss(blocks: WorkoutBlock[]): number {
  return expandBlocks(blocks).reduce((sum, step) => {
    if (step.kind === "free") {
      return sum;
    }
    const a = step.from;
    const b = step.kind === "ramp" ? step.to : step.from;
    const meanSquare = (a * a + a * b + b * b) / 3;
    return sum + (step.seconds * meanSquare) / 36;
  }, 0);
}
