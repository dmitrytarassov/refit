import { DEFAULT_STEP_SECONDS, RAMP_RANGE } from "./planner-defaults";
import { ZONE_TARGETS } from "./planner-zones";

import type { WorkoutStep } from "../types/workout-step";

export function makeZoneStep(zone: number): WorkoutStep {
  const target = ZONE_TARGETS[zone - 1];
  return {
    kind: "steady",
    seconds: DEFAULT_STEP_SECONDS,
    from: target,
    to: target,
  };
}

export function makeToolStep(
  tool: "rampUp" | "rampDown" | "free",
): WorkoutStep {
  if (tool === "free") {
    return { kind: "free", seconds: DEFAULT_STEP_SECONDS, from: 0.5, to: 0.5 };
  }
  const up = tool === "rampUp";
  return {
    kind: "ramp",
    seconds: DEFAULT_STEP_SECONDS,
    from: up ? RAMP_RANGE.from : RAMP_RANGE.to,
    to: up ? RAMP_RANGE.to : RAMP_RANGE.from,
  };
}
