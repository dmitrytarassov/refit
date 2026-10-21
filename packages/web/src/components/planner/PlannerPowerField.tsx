import type { ReactElement } from "react";

import { useT } from "../../hooks/use-translation";

interface PlannerPowerFieldProps {
  label: string;
  /** Target as a fraction of FTP. */
  fraction: number;
  ftp: number;
  onChange: (fraction: number) => void;
}

/** One target as % FTP and as watts — two inputs bound to the same fraction, committed on blur / Enter. */
export function PlannerPowerField({
  label,
  fraction,
  ftp,
  onChange,
}: PlannerPowerFieldProps): ReactElement {
  const { t } = useT();
  const percent = Math.round(fraction * 100);
  const watts = Math.round(fraction * ftp);

  const commit = (unit: "percent" | "watts", raw: string): void => {
    const value = Number(raw);
    if (Number.isNaN(value) || value <= 0) {
      return;
    }
    const next = unit === "percent" ? value / 100 : value / ftp;
    if (next !== fraction) {
      onChange(next);
    }
  };

  return (
    <div className="planner-step-field">
      <span>{label}</span>
      <div className="planner-step-field-inputs">
        <label className="planner-step-unit">
          <input
            type="number"
            min={1}
            step={1}
            key={`percent-${percent}`}
            defaultValue={percent}
            onBlur={(event) => commit("percent", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />
          {t.planner.percentFtp}
        </label>
        <label className="planner-step-unit">
          <input
            type="number"
            min={1}
            step={1}
            key={`watts-${watts}`}
            defaultValue={watts}
            onBlur={(event) => commit("watts", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />
          {t.planner.watts}
        </label>
      </div>
    </div>
  );
}
