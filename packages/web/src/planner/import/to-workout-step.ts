import type { ParsedStep } from "../../types/parsed-step";
import type { WorkoutStep } from "../../types/workout-step";

/** Watts become a fraction of the given FTP; a step without a target is a free ride. */
export function toWorkoutStep(parsed: ParsedStep, ftp: number): WorkoutStep {
  const target = parsed.watts == null ? 0.5 : parsed.watts / ftp;
  const step: WorkoutStep = {
    kind: parsed.watts == null ? "free" : "steady",
    seconds: parsed.seconds,
    from: target,
    to: target,
  };
  return parsed.note == null ? step : { ...step, note: parsed.note };
}
