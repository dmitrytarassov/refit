import type { ReactElement } from "react";

import { useT } from "../../hooks/use-translation";

interface PlannerZoneButtonProps {
  zone: number;
  onClick: () => void;
}

export function PlannerZoneButton({
  zone,
  onClick,
}: PlannerZoneButtonProps): ReactElement {
  const { t } = useT();
  return (
    <button
      type="button"
      className="planner-zone-button"
      data-zone={zone}
      style={{ background: `var(--zone-${zone})` }}
      aria-label={t.planner.zoneStep(zone)}
      onClick={onClick}
    >
      Z{zone}
    </button>
  );
}
