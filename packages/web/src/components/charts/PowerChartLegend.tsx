import { deferCall } from "just-defer-call";
import type { ReactElement } from "react";

import { CHART_PALETTE } from "../../charts/chart-palette";
import { useTheme } from "../../hooks/use-theme";
import { useT } from "../../hooks/use-translation";
import "./PowerChartLegend.css";

interface PowerChartLegendProps {
  hasOriginal: boolean;
  visible: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export function PowerChartLegend({
  hasOriginal,
  visible,
  onToggle,
}: PowerChartLegendProps): ReactElement {
  const { t } = useT();
  const { mode } = useTheme();
  const palette = CHART_PALETTE[mode];
  const itemClass = (key: string): string =>
    visible[key] ? "power-chart-legend-item" : "power-chart-legend-item is-off";

  return (
    <div className="power-chart-legend">
      <button
        type="button"
        className={itemClass("enhanced")}
        aria-pressed={visible.enhanced}
        onClick={deferCall(onToggle, "enhanced")}
      >
        <svg width="20" height="6" aria-hidden="true">
          <line
            x1="0"
            y1="3"
            x2="20"
            y2="3"
            stroke={palette.enhanced}
            strokeWidth="2"
          />
        </svg>
        {t.charts.legendEnhanced}
      </button>
      {hasOriginal && (
        <button
          type="button"
          className={itemClass("original")}
          aria-pressed={visible.original}
          onClick={deferCall(onToggle, "original")}
        >
          <svg width="20" height="6" aria-hidden="true">
            <line
              x1="0"
              y1="3"
              x2="20"
              y2="3"
              stroke={palette.original}
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          </svg>
          {t.charts.legendOriginal}
        </button>
      )}
    </div>
  );
}
