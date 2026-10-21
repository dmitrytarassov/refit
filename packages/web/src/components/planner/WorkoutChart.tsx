import type { ReactElement } from "react";

import { WorkoutChartCaption } from "./WorkoutChartCaption";
import { WorkoutChartRepeat } from "./WorkoutChartRepeat";
import { WorkoutChartStep } from "./WorkoutChartStep";
import { WorkoutTimeAxis } from "./WorkoutTimeAxis";
import { WorkoutZoneLines } from "./WorkoutZoneLines";
import "./WorkoutChart.css";

import { useT } from "../../hooks/use-translation";
import { useWorkoutChart } from "../../hooks/use-workout-chart";
import { sameStepRef } from "../../planner/same-step-ref";
import type { StepRef } from "../../types/step-ref";
import type { Workout } from "../../types/workout";

interface WorkoutChartProps {
  workout: Workout;
  selected: StepRef | null;
  onSelect: (ref: StepRef) => void;
  onToggleRepeat: (index: number) => void;
  onEditRepeat: (index: number) => void;
}

export function WorkoutChart({
  workout,
  selected,
  onSelect,
  onToggleRepeat,
  onEditRepeat,
}: WorkoutChartProps): ReactElement {
  const { t } = useT();
  const { totalSeconds, axis, tickStep, yMax, captions, levels } =
    useWorkoutChart(workout);

  return (
    <figure className="workout-chart" aria-label={t.planner.chart}>
      <div className="workout-chart-plot">
        <WorkoutZoneLines yMax={yMax} />
        {captions.map((caption, i) => (
          <WorkoutChartCaption
            key={caption.atSeconds}
            caption={caption}
            axis={axis}
            level={levels[i]}
          />
        ))}
        <div
          className="workout-chart-steps"
          style={{ width: `${(totalSeconds / axis) * 100}%` }}
        >
          {workout.blocks.map((block, i) =>
            block.kind === "repeat" ? (
              <WorkoutChartRepeat
                key={i}
                index={i}
                block={block}
                yMax={yMax}
                selected={selected}
                onSelect={onSelect}
                onToggle={onToggleRepeat}
                onEdit={onEditRepeat}
              />
            ) : (
              <WorkoutChartStep
                key={i}
                stepRef={{ index: i }}
                step={block}
                yMax={yMax}
                selected={sameStepRef(selected, { index: i })}
                onSelect={onSelect}
              />
            ),
          )}
        </div>
      </div>
      <WorkoutTimeAxis axis={axis} tickStep={tickStep} />
    </figure>
  );
}
