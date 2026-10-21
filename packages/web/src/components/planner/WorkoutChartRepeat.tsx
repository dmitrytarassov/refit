import type { ReactElement } from "react";

import { WorkoutChartStep } from "./WorkoutChartStep";
import { WorkoutRepeatBar } from "./WorkoutRepeatBar";

import { repeatSeconds } from "../../planner/repeat-seconds";
import { sameStepRef } from "../../planner/same-step-ref";
import type { RepeatBlock } from "../../types/repeat-block";
import type { StepRef } from "../../types/step-ref";

interface WorkoutChartRepeatProps {
  index: number;
  block: RepeatBlock;
  yMax: number;
  selected: StepRef | null;
  onSelect: (ref: StepRef) => void;
  onToggle: (index: number) => void;
  onEdit: (index: number) => void;
}

/**
 * A repeat block on the timeline: as wide as its whole ridden length, its
 * steps drawn once at their share of the cycle, the ×N bar across the bottom.
 */
export function WorkoutChartRepeat({
  index,
  block,
  yMax,
  selected,
  onSelect,
  onToggle,
  onEdit,
}: WorkoutChartRepeatProps): ReactElement {
  const isSelected = sameStepRef(selected, { index });

  return (
    <div
      className={isSelected ? "workout-repeat is-selected" : "workout-repeat"}
      style={{ flexGrow: repeatSeconds(block), flexBasis: 0 }}
    >
      <div className="workout-repeat-steps">
        {block.steps.map((step, child) => (
          <WorkoutChartStep
            key={child}
            stepRef={{ index, child }}
            step={step}
            yMax={yMax}
            selected={sameStepRef(selected, { index, child })}
            onSelect={onSelect}
          />
        ))}
      </div>
      <WorkoutRepeatBar
        index={index}
        times={block.times}
        selected={isSelected}
        onToggle={onToggle}
        onEdit={onEdit}
      />
    </div>
  );
}
