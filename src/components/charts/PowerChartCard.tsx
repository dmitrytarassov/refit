import type { ReactElement } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PowerZonesPanel } from "./PowerZonesPanel";
import { ChartCard } from "./ui/ChartCard";
import { ChartTooltip } from "./ui/ChartTooltip";

import { CHART_PALETTE } from "../../charts/chart-palette";
import { formatDuration } from "../../fit/format-metrics";
import { usePowerSeries } from "../../hooks/use-power-series";
import { useTheme } from "../../hooks/use-theme";
import type { Activity } from "../../types/activity";
import "./PowerChartCard.css";

interface PowerChartCardProps {
  activity: Activity;
}

export function PowerChartCard({
  activity,
}: PowerChartCardProps): ReactElement {
  const points = usePowerSeries(activity);
  const { mode } = useTheme();
  const palette = CHART_PALETTE[mode];
  const hasOriginal = points.some((p) => p.original != null);

  const legend = (
    <div className="power-chart-legend">
      <span className="power-chart-legend-item">
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
        Power (Enhanced)
      </span>
      <span className="power-chart-legend-item">
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
        Power (Original)
      </span>
    </div>
  );

  return (
    <ChartCard title="Power" aside={legend}>
      <div className="power-chart-body">
        <div className="power-chart-plot">
          {points.length === 0 ? (
            <p className="power-chart-empty">No power data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={points}
                margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke={palette.grid}
                  strokeWidth={1}
                />
                <XAxis
                  dataKey="t"
                  tickFormatter={(t) => formatDuration(Number(t))}
                  tick={{ fill: palette.axis, fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={32}
                />
                <YAxis
                  unit=" W"
                  width={56}
                  tick={{ fill: palette.axis, fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={(props) => <ChartTooltip {...props} unit="W" />}
                  cursor={{ stroke: palette.grid }}
                />
                {hasOriginal && (
                  <Line
                    dataKey="original"
                    name="Original"
                    stroke={palette.original}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    dot={false}
                    isAnimationActive={false}
                  />
                )}
                <Line
                  dataKey="enhanced"
                  name="Enhanced"
                  stroke={palette.enhanced}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <PowerZonesPanel activity={activity} />
      </div>
    </ChartCard>
  );
}
