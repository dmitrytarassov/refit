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

import { CHART_PALETTE } from "../../charts/chart-palette";
import { formatCurveTick } from "../../charts/format-curve-tick";
import { usePowerCurve } from "../../hooks/use-power-curve";
import { useTheme } from "../../hooks/use-theme";
import { useT } from "../../hooks/use-translation";
import type { Activity } from "../../types/activity";
import { ChartCard } from "../charts/ui/ChartCard";
import { ChartFillGradient } from "../charts/ui/ChartFillGradient";
import { ChartTooltip } from "../charts/ui/ChartTooltip";
import { HelpTip } from "../common/ui/HelpTip";
import "./PowerCurveCard.css";

interface PowerCurveCardProps {
  activity: Activity;
}

export function PowerCurveCard({
  activity,
}: PowerCurveCardProps): ReactElement {
  const { t } = useT();
  const curve = usePowerCurve(activity);
  const { mode } = useTheme();
  const palette = CHART_PALETTE[mode];
  const maxDuration = curve.at(-1)?.durationSec ?? 0;
  const ticks = [1, 5, 30, 60, 300, 1200, 3600, 10800].filter(
    (t) => t <= maxDuration,
  );

  return (
    <ChartCard
      title={t.charts.titles.powerCurve}
      aside={<HelpTip text={t.metricHelp.powerCurve} />}
    >
      {curve.length === 0 || curve[0].watts === 0 ? (
        <p className="power-curve-empty">{t.charts.noData.power}</p>
      ) : (
        <div className="power-curve-plot">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={curve}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <ChartFillGradient
                  id="power-curve-fill"
                  color={palette.power}
                />
              </defs>
              <CartesianGrid
                vertical={false}
                stroke={palette.grid}
                strokeWidth={1}
              />
              <XAxis
                dataKey="durationSec"
                type="number"
                scale="log"
                domain={[1, "dataMax"]}
                ticks={ticks}
                tickFormatter={(t) => formatCurveTick(Number(t))}
                tick={{ fill: palette.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                unit={` ${t.common.units.w}`}
                width={64}
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
              <Area
                dataKey="watts"
                name={t.charts.thisRide}
                stroke={palette.power}
                strokeWidth={2}
                fill="url(#power-curve-fill)"
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
