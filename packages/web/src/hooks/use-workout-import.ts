import { useState } from "react";

import { parseWorkoutText } from "../planner/parse-workout-text";
import type { WorkoutBlock } from "../types/repeat-block";

/**
 * State of the paste dialog: the text, whether the last apply failed, and —
 * when the plan already has blocks — the parsed result waiting for the
 * replace / append choice. An empty plan is replaced right away.
 */
export function useWorkoutImport(options: {
  ftp: number;
  hasBlocks: boolean;
  onReplace: (blocks: WorkoutBlock[]) => void;
  onAppend: (blocks: WorkoutBlock[]) => void;
  onClose: () => void;
}): {
  text: string;
  failed: boolean;
  pending: boolean;
  setText: (text: string) => void;
  apply: () => void;
  replace: () => void;
  append: () => void;
} {
  const [text, setText] = useState("");
  const [failed, setFailed] = useState(false);
  const [parsed, setParsed] = useState<WorkoutBlock[] | null>(null);

  const apply = (): void => {
    const blocks = parseWorkoutText(text, options.ftp);
    if (blocks == null || blocks.length === 0) {
      setFailed(true);
      return;
    }
    if (!options.hasBlocks) {
      options.onReplace(blocks);
      options.onClose();
      return;
    }
    setParsed(blocks);
  };

  const finish = (apply: (blocks: WorkoutBlock[]) => void): void => {
    if (parsed != null) {
      apply(parsed);
      options.onClose();
    }
  };

  return {
    text,
    failed,
    pending: parsed != null,
    setText: (next) => {
      setText(next);
      setFailed(false);
      setParsed(null);
    },
    apply,
    replace: () => finish(options.onReplace),
    append: () => finish(options.onAppend),
  };
}
