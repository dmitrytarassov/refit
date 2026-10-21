import type { ReactElement } from "react";

import { useT } from "../../hooks/use-translation";

interface PlannerDurationFieldProps {
  seconds: number;
  onChange: (seconds: number) => void;
}

/** Minutes + seconds inputs; committed on blur / Enter, a zero total is ignored. */
export function PlannerDurationField({
  seconds,
  onChange,
}: PlannerDurationFieldProps): ReactElement {
  const { t } = useT();
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;

  const commit = (part: "min" | "sec", raw: string): void => {
    const value = Math.max(0, Math.floor(Number(raw)));
    if (Number.isNaN(value)) {
      return;
    }
    const next = part === "min" ? value * 60 + rest : minutes * 60 + value;
    if (next > 0 && next !== seconds) {
      onChange(next);
    }
  };

  return (
    <div className="planner-step-field">
      <span>{t.planner.duration}</span>
      <div className="planner-step-field-inputs">
        <label className="planner-step-unit">
          <input
            type="number"
            min={0}
            step={1}
            key={`min-${minutes}`}
            defaultValue={minutes}
            onBlur={(event) => commit("min", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />
          {t.planner.minutes}
        </label>
        <label className="planner-step-unit">
          <input
            type="number"
            min={0}
            max={59}
            step={1}
            key={`sec-${rest}`}
            defaultValue={rest}
            onBlur={(event) => commit("sec", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />
          {t.planner.seconds}
        </label>
      </div>
    </div>
  );
}
