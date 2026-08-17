import type { ReactElement } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "./ui/ChartCard";
import { ChartTooltip } from "./ui/ChartTooltip";

import { CHART_PALETTE } from "../../charts/chart-palette";
import { formatDuration } from "../../fit/format-metrics";
import { useRecordSeries } from "../../hooks/use-record-series";
import { useTheme } from "../../hooks/use-theme";
import type { Activity } from "../../types/activity";
import "./ElevationChartCard.css";

interface ElevationChartCardProps {
  activity: Activity;
}

export function ElevationChartCard({
  activity,
}: ElevationChartCardProps): ReactElement {
  const { elevation } = useRecordSeries(activity);
  const { mode } = useTheme();
  const palette = CHART_PALETTE[mode];

  return (
    <ChartCard title="Elevation">
      {elevation.length === 0 ? (
        <p className="elevation-chart-empty">No elevation data</p>
      ) : (
        <div className="elevation-chart-plot">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={elevation}
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
                unit=" m"
                width={56}
                tick={{ fill: palette.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={(props) => <ChartTooltip {...props} unit="m" />}
                cursor={{ stroke: palette.grid }}
              />
              <Area
                dataKey="value"
                name="Elevation"
                stroke={palette.elevation}
                strokeWidth={1.5}
                fill={palette.elevation}
                fillOpacity={0.4}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
