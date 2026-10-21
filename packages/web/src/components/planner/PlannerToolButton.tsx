import type { ReactElement, ReactNode } from "react";

interface PlannerToolButtonProps {
  label: string;
  children: ReactNode;
  onClick: () => void;
}

/** Icon-only toolbar button; `label` is its accessible name. */
export function PlannerToolButton({
  label,
  children,
  onClick,
}: PlannerToolButtonProps): ReactElement {
  return (
    <button
      type="button"
      className="planner-tool-button"
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
