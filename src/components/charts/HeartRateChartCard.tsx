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

import { CombinedChart } from "./CombinedChart";
import { ChartCard } from "./ui/ChartCard";
import { ChartFillGradient } from "./ui/ChartFillGradient";
import { ChartTooltip } from "./ui/ChartTooltip";

import { CHART_PALETTE } from "../../charts/chart-palette";
import { formatDuration } from "../../fit/format-metrics";
import { useRecordSeries } from "../../hooks/use-record-series";
import { useTheme } from "../../hooks/use-theme";
import type { Activity } from "../../types/activity";
import "./HeartRateChartCard.css";

interface HeartRateChartCardProps {
  activity: Activity;
}

export function HeartRateChartCard({
  activity,
}: HeartRateChartCardProps): ReactElement {
  const { heartRate } = useRecordSeries(activity);
  const { mode } = useTheme();
  const palette = CHART_PALETTE[mode];

  return (
    <ChartCard
      title="Heart Rate"
      expanded={<CombinedChart activity={activity} initial="heartRate" />}
    >
      {heartRate.length === 0 ? (
        <p className="heart-rate-chart-empty">No heart rate data</p>
      ) : (
        <div className="heart-rate-chart-plot">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={heartRate}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <ChartFillGradient
                  id="heart-rate-fill"
                  color={palette.heartRate}
                />
              </defs>
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
                unit=" bpm"
                width={64}
                tick={{ fill: palette.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={(props) => <ChartTooltip {...props} unit="bpm" />}
                cursor={{ stroke: palette.grid }}
              />
              <Area
                dataKey="value"
                name="Heart Rate"
                stroke={palette.heartRate}
                strokeWidth={1.5}
                fill="url(#heart-rate-fill)"
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
