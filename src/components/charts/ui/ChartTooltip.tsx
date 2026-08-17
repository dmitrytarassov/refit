import type { ReactElement } from "react";
import type { TooltipContentProps } from "recharts";

import { CHART_PALETTE } from "../../../charts/chart-palette";
import { formatDistance, formatDuration } from "../../../fit/format-metrics";
import { useTheme } from "../../../hooks/use-theme";
import "./ChartTooltip.css";

type ChartTooltipProps = TooltipContentProps & {
  unit?: string;
  units?: Record<string, string>;
};

export function ChartTooltip({
  active,
  payload,
  label,
  unit,
  units,
}: ChartTooltipProps): ReactElement | null {
  const { mode } = useTheme();
  const palette = CHART_PALETTE[mode];
  if (!active || !payload?.length) {
    return null;
  }
  const distance = (payload[0]?.payload as { d?: number } | undefined)?.d;
  return (
    <div
      className="chart-tooltip"
      style={{
        background: palette.tooltipBg,
        borderColor: palette.tooltipBorder,
        color: palette.tooltipText,
      }}
    >
      <div className="chart-tooltip-head">
        <span className="chart-tooltip-time">
          {formatDuration(Number(label))}
        </span>
        {distance != null && (
          <span className="chart-tooltip-distance">
            {formatDistance(distance)}
          </span>
        )}
      </div>
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
            {units?.[String(item.dataKey)] ?? unit ?? ""}
          </span>
        </div>
      ))}
    </div>
  );
}
