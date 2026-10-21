import { useCallback, useReducer } from "react";

import { historyReducer } from "../planner/history-reducer";
import type { History, HistoryAction } from "../types/history";

/** `useState` with an undo stack: `set` takes an updater and records a step; `reset` starts a fresh history (stable identity, safe as an effect dependency). */
export function useHistoryState<T>(initial: T): {
  state: T;
  canUndo: boolean;
  canRedo: boolean;
  set: (update: (current: T) => T) => void;
  reset: (value: T) => void;
  undo: () => void;
  redo: () => void;
} {
  const [history, dispatch] = useReducer<History<T>, [HistoryAction<T>]>(
    historyReducer,
    { past: [], present: initial, future: [] },
  );
  const reset = useCallback((value: T) => {
    dispatch({ type: "reset", value });
  }, []);
  return {
    state: history.present,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    set: (update) => {
      dispatch({ type: "set", update });
    },
    undo: () => {
      dispatch({ type: "undo" });
    },
    redo: () => {
      dispatch({ type: "redo" });
    },
  };
}
