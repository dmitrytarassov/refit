/** Address of a block on the timeline: a top-level index, plus the step index inside a repeat. */
export interface StepRef {
  index: number;
  child?: number;
}
