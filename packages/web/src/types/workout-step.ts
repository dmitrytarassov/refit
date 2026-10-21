export type WorkoutStepKind = "steady" | "ramp" | "free";

/** One block of a planned workout; targets are fractions of FTP. */
export interface WorkoutStep {
  kind: WorkoutStepKind;
  seconds: number;
  /** Target at the start of the step (`steady` holds it to the end). */
  from: number;
  /** Target at the end of the step; equals `from` for `steady`, ignored for `free`. */
  to: number;
  /** Free-text hint; shown as a marker on the timeline when not blank. */
  note?: string;
}
