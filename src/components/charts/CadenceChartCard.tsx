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

import { ChartCard } from "./ui/ChartCard";
import { ChartTooltip } from "./ui/ChartTooltip";

import { CHART_PALETTE } from "../../charts/chart-palette";
import { formatDuration } from "../../fit/format-metrics";
import { useRecordSeries } from "../../hooks/use-record-series";
import { useTheme } from "../../hooks/use-theme";
import type { Activity } from "../../types/activity";
import "./CadenceChartCard.css";

interface CadenceChartCardProps {
  activity: Activity;
}

export function CadenceChartCard({
  activity,
}: CadenceChartCardProps): ReactElement {
  const { cadence } = useRecordSeries(activity);
  const { mode } = useTheme();
  const palette = CHART_PALETTE[mode];

  return (
    <ChartCard title="Cadence">
      {cadence.length === 0 ? (
        <p className="cadence-chart-empty">No cadence data</p>
      ) : (
        <div className="cadence-chart-plot">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={cadence}
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
                unit=" rpm"
                width={64}
                tick={{ fill: palette.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={(props) => <ChartTooltip {...props} unit="rpm" />}
                cursor={{ stroke: palette.grid }}
              />
              <Line
                dataKey="value"
                name="Cadence"
                stroke={palette.cadence}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
