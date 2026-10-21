import type { History, HistoryAction } from "../types/history";

const HISTORY_LIMIT = 100;

/** `set` pushes the present onto the past and clears the future; `undo` / `redo` walk the stacks; `reset` replaces everything with a fresh present. An update that returns the same value is not recorded. */
export function historyReducer<T>(
  state: History<T>,
  action: HistoryAction<T>,
): History<T> {
  if (action.type === "set") {
    const next = action.update(state.present);
    if (next === state.present) {
      return state;
    }
    return {
      past: [...state.past, state.present].slice(-HISTORY_LIMIT),
      present: next,
      future: [],
    };
  }
  if (action.type === "reset") {
    return action.value === state.present && state.past.length === 0
      ? state
      : { past: [], present: action.value, future: [] };
  }
  if (action.type === "undo") {
    const previous = state.past.at(-1);
    if (previous === undefined) {
      return state;
    }
    return {
      past: state.past.slice(0, -1),
      present: previous,
      future: [state.present, ...state.future],
    };
  }
  const [next, ...future] = state.future;
  if (next === undefined) {
    return state;
  }
  return { past: [...state.past, state.present], present: next, future };
}
