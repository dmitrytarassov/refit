import type { ReactElement } from "react";

import "./MetricTile.css";

interface MetricTileProps {
  label: string;
  value: string;
  unit?: string;
  muted?: boolean;
}

export function MetricTile({
  label,
  value,
  unit,
  muted,
}: MetricTileProps): ReactElement {
  return (
    <div className={muted ? "metric-tile metric-tile-muted" : "metric-tile"}>
      <span className="metric-tile-label">{label}</span>
      <span className="metric-tile-value">
        {value}
        {unit != null && <span className="metric-tile-unit">{unit}</span>}
      </span>
    </div>
  );
}
