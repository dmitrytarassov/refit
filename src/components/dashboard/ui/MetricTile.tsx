import type { ReactElement } from "react";

import "./MetricTile.css";
import { HelpTip } from "../../common/ui/HelpTip";

interface MetricTileProps {
  label: string;
  value: string;
  unit?: string;
  muted?: boolean;
  help?: string;
}

export function MetricTile({
  label,
  value,
  unit,
  muted,
  help,
}: MetricTileProps): ReactElement {
  return (
    <div className={muted ? "metric-tile metric-tile-muted" : "metric-tile"}>
      {help != null && (
        <span className="metric-tile-help">
          <HelpTip text={help} />
        </span>
      )}
      <span className="metric-tile-label">{label}</span>
      <span className="metric-tile-value">
        {value}
        {unit != null && <span className="metric-tile-unit">{unit}</span>}
      </span>
    </div>
  );
}
