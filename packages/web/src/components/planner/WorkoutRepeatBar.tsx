import { deferCall } from "just-defer-call";
import { Pencil } from "lucide-react";
import type { ReactElement } from "react";

import { useT } from "../../hooks/use-translation";

interface WorkoutRepeatBarProps {
  index: number;
  times: number;
  selected: boolean;
  onToggle: (index: number) => void;
  onEdit: (index: number) => void;
}

export function WorkoutRepeatBar({
  index,
  times,
  selected,
  onToggle,
  onEdit,
}: WorkoutRepeatBarProps): ReactElement {
  const { t } = useT();
  return (
    <div className="workout-repeat-bar">
      <button
        type="button"
        className="workout-repeat-toggle"
        aria-pressed={selected}
        aria-label={t.planner.repeatBlock(times)}
        onClick={deferCall(onToggle, index)}
      >
        ×{times}
      </button>
      <button
        type="button"
        className="workout-repeat-edit"
        aria-label={t.planner.editRepeat}
        onClick={deferCall(onEdit, index)}
      >
        <Pencil size={13} aria-hidden="true" />
      </button>
    </div>
  );
}
