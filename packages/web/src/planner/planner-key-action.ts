/** Keys typed into a form control belong to it (native undo, Backspace in a field). */
function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

/**
 * Planner shortcut for a keydown: Delete / Backspace removes the selection,
 * Ctrl/⌘+Z undoes, Ctrl/⌘+Shift+Z or Ctrl/⌘+Y redoes.
 */
export function plannerKeyAction(
  event: KeyboardEvent,
): "delete" | "undo" | "redo" | null {
  if (isTypingTarget(event.target)) {
    return null;
  }
  const modifier = event.metaKey || event.ctrlKey;
  const key = event.key.toLowerCase();
  if (modifier) {
    if (key === "z") {
      return event.shiftKey ? "redo" : "undo";
    }
    return key === "y" ? "redo" : null;
  }
  return key === "delete" || key === "backspace" ? "delete" : null;
}
