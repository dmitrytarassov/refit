import { deferCall } from "just-defer-call";
import type { ReactElement } from "react";

import "./PlannerStepperField.css";
import { useT } from "../../hooks/use-translation";

interface PlannerStepperFieldProps {
  label: string;
  value: number;
  step: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function PlannerStepperField({
  label,
  value,
  step,
  min,
  max,
  onChange,
}: PlannerStepperFieldProps): ReactElement {
  const { t } = useT();
  return (
    <label className="planner-stepper">
      <span className="planner-stepper-label">{label}</span>
      <span className="planner-stepper-control">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (!Number.isNaN(next)) {
              onChange(next);
            }
          }}
        />
        <span className="planner-stepper-buttons">
          <button
            type="button"
            onClick={deferCall(onChange, Math.min(max, value + step))}
            disabled={value >= max}
            aria-label={t.planner.increase(label)}
          >
            +
          </button>
          <button
            type="button"
            onClick={deferCall(onChange, Math.max(min, value - step))}
            disabled={value <= min}
            aria-label={t.planner.decrease(label)}
          >
            −
          </button>
        </span>
      </span>
    </label>
  );
}
