import type { ReactElement } from "react";
import type { TooltipContentProps } from "recharts";

import { CHART_PALETTE } from "../../../charts/chart-palette";
import { formatDuration } from "../../../fit/format-metrics";
import { useTheme } from "../../../hooks/use-theme";
import "./ChartTooltip.css";

type ChartTooltipProps = TooltipContentProps & { unit: string };

export function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: ChartTooltipProps): ReactElement | null {
  const { mode } = useTheme();
  const palette = CHART_PALETTE[mode];
  if (!active || !payload?.length) {
    return null;
  }
  return (
    <div
      className="chart-tooltip"
      style={{
        background: palette.tooltipBg,
        borderColor: palette.tooltipBorder,
        color: palette.tooltipText,
      }}
    >
      <div className="chart-tooltip-time">{formatDuration(Number(label))}</div>
      {payload.map((item) => (
        <div className="chart-tooltip-row" key={String(item.dataKey)}>
          <span
            className="chart-tooltip-dot"
            style={{ background: item.color }}
          />
          <span className="chart-tooltip-name">{item.name}</span>
          <span className="chart-tooltip-value">
            {typeof item.value === "number"
              ? Math.round(item.value)
              : String(item.value)}{" "}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
