import { X } from "lucide-react";
import type { ReactElement } from "react";

import { PlannerDurationField } from "./PlannerDurationField";
import { PlannerPowerField } from "./PlannerPowerField";
import "./PlannerStepEditor.css";

import { useT } from "../../hooks/use-translation";
import type { StepRef } from "../../types/step-ref";
import type { WorkoutStep } from "../../types/workout-step";

interface PlannerStepEditorProps {
  stepRef: StepRef;
  step: WorkoutStep;
  ftp: number;
  onChange: (ref: StepRef, patch: Partial<WorkoutStep>) => void;
  onClose: () => void;
}

export function PlannerStepEditor({
  stepRef,
  step,
  ftp,
  onChange,
  onClose,
}: PlannerStepEditorProps): ReactElement {
  const { t } = useT();
  const title =
    stepRef.child == null
      ? t.planner.block(stepRef.index + 1)
      : t.planner.repeatStep(stepRef.index + 1, stepRef.child + 1);
  const key = `${stepRef.index}-${stepRef.child ?? "top"}`;
  return (
    <section className="planner-step-editor" aria-label={title}>
      <header className="planner-step-editor-header">
        <h3>{title}</h3>
        <button
          type="button"
          className="planner-step-editor-close"
          onClick={onClose}
          aria-label={t.nav.close}
        >
          <X size={16} aria-hidden="true" />
        </button>
      </header>
      <div className="planner-step-editor-fields">
        <PlannerDurationField
          key={`duration-${key}`}
          seconds={step.seconds}
          onChange={(seconds) => onChange(stepRef, { seconds })}
        />
        {step.kind === "steady" && (
          <PlannerPowerField
            key={`power-${key}`}
            label={t.planner.power}
            fraction={step.from}
            ftp={ftp}
            onChange={(fraction) =>
              onChange(stepRef, { from: fraction, to: fraction })
            }
          />
        )}
        {step.kind === "ramp" && (
          <>
            <PlannerPowerField
              key={`from-${key}`}
              label={t.planner.rampStart}
              fraction={step.from}
              ftp={ftp}
              onChange={(fraction) => onChange(stepRef, { from: fraction })}
            />
            <PlannerPowerField
              key={`to-${key}`}
              label={t.planner.rampEnd}
              fraction={step.to}
              ftp={ftp}
              onChange={(fraction) => onChange(stepRef, { to: fraction })}
            />
          </>
        )}
        <label className="planner-step-note">
          <span>{t.planner.note}</span>
          <input
            type="text"
            value={step.note ?? ""}
            placeholder={t.planner.notePlaceholder}
            onChange={(event) =>
              onChange(stepRef, { note: event.target.value })
            }
          />
        </label>
      </div>
    </section>
  );
}
