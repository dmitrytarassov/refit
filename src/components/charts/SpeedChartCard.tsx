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
import { useT } from "../../hooks/use-translation";
import type { Activity } from "../../types/activity";
import "./SpeedChartCard.css";

interface SpeedChartCardProps {
  activity: Activity;
}

export function SpeedChartCard({
  activity,
}: SpeedChartCardProps): ReactElement {
  const { t } = useT();
  const { speed } = useRecordSeries(activity);
  const { mode } = useTheme();
  const palette = CHART_PALETTE[mode];

  return (
    <ChartCard
      title={t.charts.titles.speed}
      expanded={<CombinedChart activity={activity} initial="speed" />}
    >
      {speed.length === 0 ? (
        <p className="speed-chart-empty">{t.charts.noData.speed}</p>
      ) : (
        <div className="speed-chart-plot">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={speed}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <ChartFillGradient id="speed-fill" color={palette.speed} />
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
                unit={` ${t.common.units.kmh}`}
                width={72}
                tick={{ fill: palette.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={(props) => (
                  <ChartTooltip {...props} unit={t.common.units.kmh} />
                )}
                cursor={{ stroke: palette.grid }}
              />
              <Area
                dataKey="value"
                name={t.charts.titles.speed}
                stroke={palette.speed}
                strokeWidth={1.5}
                fill="url(#speed-fill)"
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
