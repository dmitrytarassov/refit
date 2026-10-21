import type { RepeatBlock } from "../types/repeat-block";

/** A freshly added repeat block: twice, nothing skipped, no steps yet. */
export const EMPTY_REPEAT: RepeatBlock = {
  kind: "repeat",
  times: 2,
  skipLast: false,
  steps: [],
};

/** Width an empty repeat block takes on the timeline until steps are added. */
export const DEFAULT_REPEAT_SECONDS = 600;
