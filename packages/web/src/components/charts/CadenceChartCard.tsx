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
import "./CadenceChartCard.css";

interface CadenceChartCardProps {
  activity: Activity;
}

export function CadenceChartCard({
  activity,
}: CadenceChartCardProps): ReactElement {
  const { t } = useT();
  const { cadence } = useRecordSeries(activity);
  const { mode } = useTheme();
  const palette = CHART_PALETTE[mode];

  return (
    <ChartCard
      title={t.charts.titles.cadence}
      expanded={<CombinedChart activity={activity} initial="cadence" />}
    >
      {cadence.length === 0 ? (
        <p className="cadence-chart-empty">{t.charts.noData.cadence}</p>
      ) : (
        <div className="cadence-chart-plot">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={cadence}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <ChartFillGradient id="cadence-fill" color={palette.cadence} />
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
                unit={` ${t.common.units.rpm}`}
                width={64}
                tick={{ fill: palette.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={(props) => (
                  <ChartTooltip {...props} unit={t.common.units.rpm} />
                )}
                cursor={{ stroke: palette.grid }}
              />
              <Area
                dataKey="value"
                name={t.charts.titles.cadence}
                stroke={palette.cadence}
                strokeWidth={1.5}
                fill="url(#cadence-fill)"
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
