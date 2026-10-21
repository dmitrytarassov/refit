/** Undo stack around one value: everything before and after the present. */
export interface History<T> {
  past: T[];
  present: T;
  future: T[];
}

export type HistoryAction<T> =
  | { type: "set"; update: (current: T) => T }
  | { type: "reset"; value: T }
  | { type: "undo" }
  | { type: "redo" };
