import { MessageSquareText } from "lucide-react";
import type { ReactElement } from "react";

import type { WorkoutCaption } from "../../types/workout-caption";

interface WorkoutChartCaptionProps {
  caption: WorkoutCaption;
  axis: number;
  level: number;
}

const LEVEL_STEP_PX = 30;

export function WorkoutChartCaption({
  caption,
  axis,
  level,
}: WorkoutChartCaptionProps): ReactElement {
  return (
    <div
      className="workout-caption"
      style={{ left: `${(caption.atSeconds / axis) * 100}%` }}
    >
      <span
        className="workout-caption-marker"
        style={{ top: level * LEVEL_STEP_PX }}
        title={caption.text}
      >
        <MessageSquareText size={16} aria-hidden="true" />
      </span>
    </div>
  );
}
