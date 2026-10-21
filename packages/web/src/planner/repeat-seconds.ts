import { expandRepeat } from "./expand-blocks";
import { DEFAULT_REPEAT_SECONDS } from "./repeat-defaults";

import type { RepeatBlock } from "../types/repeat-block";

/** Ridden length of a repeat: its cycle `times` over minus a skipped last step; a placeholder for an empty one. */
export function repeatSeconds(block: RepeatBlock): number {
  if (block.steps.length === 0) {
    return DEFAULT_REPEAT_SECONDS;
  }
  return expandRepeat(block).reduce((sum, copy) => sum + copy.step.seconds, 0);
}
