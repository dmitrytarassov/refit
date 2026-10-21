import { useEffect } from "react";

import { plannerKeyAction } from "../planner/planner-key-action";

/** Window-level keyboard shortcuts of the planner page (see `plannerKeyAction`). */
export function usePlannerKeys(handlers: {
  delete: () => void;
  undo: () => void;
  redo: () => void;
}): void {
  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      const action = plannerKeyAction(event);
      if (action == null) {
        return;
      }
      event.preventDefault();
      handlers[action]();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlers]);
}
