import { deferCall } from "just-defer-call";
import type { CSSProperties, ReactElement } from "react";

import { useT } from "../../hooks/use-translation";
import { zoneIndex } from "../../planner/zone-index";
import type { StepRef } from "../../types/step-ref";
import type { WorkoutStep } from "../../types/workout-step";

interface WorkoutChartStepProps {
  stepRef: StepRef;
  step: WorkoutStep;
  yMax: number;
  selected: boolean;
  onSelect: (ref: StepRef) => void;
}

export function WorkoutChartStep({
  stepRef,
  step,
  yMax,
  selected,
  onSelect,
}: WorkoutChartStepProps): ReactElement {
  const { t } = useT();
  const top = step.kind === "ramp" ? Math.max(step.from, step.to) : step.from;
  let fillClass = "workout-chart-step-fill";
  let fill: CSSProperties | undefined;
  if (step.kind === "free") {
    fillClass += " is-free";
  } else if (step.kind === "ramp") {
    fillClass += " is-ramp";
    fill = {
      background: `linear-gradient(90deg, var(--zone-${zoneIndex(step.from)}), var(--zone-${zoneIndex(step.to)}))`,
      clipPath: `polygon(0 ${(1 - step.from / top) * 100}%, 100% ${(1 - step.to / top) * 100}%, 100% 100%, 0 100%)`,
    };
  } else {
    fill = { background: `var(--zone-${zoneIndex(step.from)})` };
  }

  return (
    <button
      type="button"
      className={
        selected ? "workout-chart-step is-selected" : "workout-chart-step"
      }
      style={{
        flexGrow: step.seconds,
        flexBasis: 0,
        height: `${(top / yMax) * 100}%`,
      }}
      aria-pressed={selected}
      aria-label={
        stepRef.child == null
          ? t.planner.block(stepRef.index + 1)
          : t.planner.repeatStep(stepRef.index + 1, stepRef.child + 1)
      }
      onClick={deferCall(onSelect, stepRef)}
    >
      <span className={fillClass} style={fill} />
    </button>
  );
}
