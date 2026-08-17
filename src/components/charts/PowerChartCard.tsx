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

import { CombinedChart } from "./CombinedChart";
import { PowerZonesPanel } from "./PowerZonesPanel";
import { ChartCard } from "./ui/ChartCard";
import { ChartTooltip } from "./ui/ChartTooltip";

import { CHART_PALETTE } from "../../charts/chart-palette";
import { formatDuration } from "../../fit/format-metrics";
import { usePowerSeries } from "../../hooks/use-power-series";
import { useTheme } from "../../hooks/use-theme";
import { useT } from "../../hooks/use-translation";
import type { Activity } from "../../types/activity";
import "./PowerChartCard.css";

interface PowerChartCardProps {
  activity: Activity;
}

export function PowerChartCard({
  activity,
}: PowerChartCardProps): ReactElement {
  const { t } = useT();
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
        {t.charts.legendEnhanced}
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
        {t.charts.legendOriginal}
      </span>
    </div>
  );

  return (
    <ChartCard
      title={t.charts.titles.power}
      aside={legend}
      expanded={<CombinedChart activity={activity} initial="power" />}
    >
      <div className="power-chart-body">
        <div className="power-chart-plot">
          {points.length === 0 ? (
            <p className="power-chart-empty">{t.charts.noData.power}</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
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
                  unit={` ${t.common.units.w}`}
                  width={56}
                  tick={{ fill: palette.axis, fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={(props) => (
                    <ChartTooltip {...props} unit={t.common.units.w} />
                  )}
                  cursor={{ stroke: palette.grid }}
                />
                {hasOriginal && (
                  <Line
                    dataKey="original"
                    name={t.charts.seriesOriginal}
                    stroke={palette.original}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    dot={false}
                    isAnimationActive={false}
                  />
                )}
                <Line
                  dataKey="enhanced"
                  name={t.charts.seriesEnhanced}
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
