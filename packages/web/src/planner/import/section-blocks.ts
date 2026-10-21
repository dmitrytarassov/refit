import { toWorkoutStep } from "./to-workout-step";

import type { ParsedItem } from "../../types/parsed-step";
import type { RepeatBlock, WorkoutBlock } from "../../types/repeat-block";

/**
 * Applies the multiplier rule of a section: steps before `N×` are plain; the
 * steps after it go into a repeat, except the section's last step, which
 * stays plain (a later multiplier closes the previous repeat). A repeat that
 * would end up empty takes that last step instead.
 */
export function sectionBlocks(
  items: ParsedItem[],
  ftp: number,
): WorkoutBlock[] {
  const blocks: WorkoutBlock[] = [];
  const total = items.filter((item) => item.kind === "step").length;
  let repeat: RepeatBlock | null = null;
  let seen = 0;
  for (const item of items) {
    if (item.kind === "times") {
      repeat = {
        kind: "repeat",
        times: item.times,
        skipLast: false,
        steps: [],
      };
      blocks.push(repeat);
      continue;
    }
    seen++;
    const step = toWorkoutStep(item.step, ftp);
    if (repeat != null && (seen < total || repeat.steps.length === 0)) {
      repeat.steps.push(step);
    } else {
      blocks.push(step);
    }
  }
  return blocks;
}
