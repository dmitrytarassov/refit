import { repeatSeconds } from "./repeat-seconds";

import type { WorkoutBlock } from "../types/repeat-block";
import type { WorkoutCaption } from "../types/workout-caption";

/**
 * Notes of the steps that have one, placed where the step is drawn: at a
 * block's start, or — inside a repeat, whose steps are drawn once across the
 * whole repeated length — at the step's share of that length.
 */
export function stepCaptions(blocks: WorkoutBlock[]): WorkoutCaption[] {
  const captions: WorkoutCaption[] = [];
  let at = 0;
  for (const block of blocks) {
    if (block.kind !== "repeat") {
      const text = block.note?.trim() ?? "";
      if (text.length > 0) {
        captions.push({ atSeconds: at, text });
      }
      at += block.seconds;
      continue;
    }
    const width = repeatSeconds(block);
    const cycle = block.steps.reduce((sum, step) => sum + step.seconds, 0);
    let offset = 0;
    for (const step of block.steps) {
      const text = step.note?.trim() ?? "";
      if (text.length > 0) {
        captions.push({ atSeconds: at + (width * offset) / cycle, text });
      }
      offset += step.seconds;
    }
    at += width;
  }
  return captions;
}
