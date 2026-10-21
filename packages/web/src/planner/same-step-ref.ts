import type { StepRef } from "../types/step-ref";

export function sameStepRef(a: StepRef | null, b: StepRef): boolean {
  return a != null && a.index === b.index && a.child === b.child;
}
