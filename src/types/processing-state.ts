import type { Activity } from "./activity";

export type ProcessingState =
  | { status: "idle" }
  | { status: "processing"; fileName: string }
  | { status: "error"; message: string }
  | { status: "ready"; activity: Activity };
