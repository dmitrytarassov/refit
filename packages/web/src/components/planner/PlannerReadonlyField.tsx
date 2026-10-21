import type { ReactElement } from "react";

import "./PlannerReadonlyField.css";

interface PlannerReadonlyFieldProps {
  label: string;
  value: string;
}

export function PlannerReadonlyField({
  label,
  value,
}: PlannerReadonlyFieldProps): ReactElement {
  return (
    <div className="planner-readonly">
      <span className="planner-readonly-label">{label}</span>
      <output className="planner-readonly-value">{value}</output>
    </div>
  );
}
