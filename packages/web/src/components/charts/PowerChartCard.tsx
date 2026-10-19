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
import { PowerChartLegend } from "./PowerChartLegend";
import { PowerZonesPanel } from "./PowerZonesPanel";
import { ChartCard } from "./ui/ChartCard";
import { ChartTooltip } from "./ui/ChartTooltip";

import { CHART_PALETTE } from "../../charts/chart-palette";
import { formatDuration } from "../../fit/format-metrics";
import { usePowerSeries } from "../../hooks/use-power-series";
import { useSeriesVisibility } from "../../hooks/use-series-visibility";
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
  const { visible, toggle } = useSeriesVisibility({
    enhanced: true,
    original: true,
  });

  return (
    <ChartCard
      title={t.charts.titles.power}
      aside={
        <PowerChartLegend
          hasOriginal={hasOriginal}
          visible={visible}
          onToggle={toggle}
        />
      }
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
                  includeHidden
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
                    hide={!visible.original}
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
                  hide={!visible.enhanced}
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
