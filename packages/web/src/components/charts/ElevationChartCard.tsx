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
import { ChartTooltip } from "./ui/ChartTooltip";

import { CHART_PALETTE } from "../../charts/chart-palette";
import { formatDuration } from "../../fit/format-metrics";
import { useRecordSeries } from "../../hooks/use-record-series";
import { useTheme } from "../../hooks/use-theme";
import { useT } from "../../hooks/use-translation";
import type { Activity } from "../../types/activity";
import "./ElevationChartCard.css";

interface ElevationChartCardProps {
  activity: Activity;
}

export function ElevationChartCard({
  activity,
}: ElevationChartCardProps): ReactElement {
  const { t } = useT();
  const { elevation } = useRecordSeries(activity);
  const { mode } = useTheme();
  const palette = CHART_PALETTE[mode];

  return (
    <ChartCard
      title={t.charts.titles.elevation}
      expanded={<CombinedChart activity={activity} initial="elevation" />}
    >
      {elevation.length === 0 ? (
        <p className="elevation-chart-empty">{t.charts.noData.elevation}</p>
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
                unit={` ${t.common.units.m}`}
                width={56}
                tick={{ fill: palette.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={(props) => (
                  <ChartTooltip {...props} unit={t.common.units.m} />
                )}
                cursor={{ stroke: palette.grid }}
              />
              <Area
                dataKey="value"
                name={t.charts.titles.elevation}
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
