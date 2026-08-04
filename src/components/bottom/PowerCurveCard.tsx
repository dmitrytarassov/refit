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

import { CHART_PALETTE } from "../../charts/chart-palette";
import { formatCurveTick } from "../../charts/format-curve-tick";
import { usePowerCurve } from "../../hooks/use-power-curve";
import { useTheme } from "../../hooks/use-theme";
import type { Activity } from "../../types/activity";
import { ChartCard } from "../charts/ui/ChartCard";
import { ChartTooltip } from "../charts/ui/ChartTooltip";
import { HelpTip } from "../common/ui/HelpTip";
import "./PowerCurveCard.css";

interface PowerCurveCardProps {
  activity: Activity;
}

export function PowerCurveCard({
  activity,
}: PowerCurveCardProps): ReactElement {
  const curve = usePowerCurve(activity);
  const { mode } = useTheme();
  const palette = CHART_PALETTE[mode];
  const maxDuration = curve.at(-1)?.durationSec ?? 0;
  const ticks = [1, 5, 30, 60, 300, 1200, 3600, 10800].filter(
    (t) => t <= maxDuration,
  );

  return (
    <ChartCard
      title="Power Curve"
      aside={
        <HelpTip text="Your best average power for every effort duration in this ride. The 5s point is your hardest 5-second burst, the 20m point your best sustained effort. Short efforts are always much higher: sprint power fades within seconds, while aerobic power can be held for hours — that is why the curve drops steeply on the left and flattens to the right." />
      }
    >
      {curve.length === 0 || curve[0].watts === 0 ? (
        <p className="power-curve-empty">No power data</p>
      ) : (
        <div className="power-curve-plot">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={curve}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
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
                unit=" W"
                width={64}
                tick={{ fill: palette.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={(props) => <ChartTooltip {...props} unit="W" />}
                cursor={{ stroke: palette.grid }}
              />
              <Line
                dataKey="watts"
                name="This Ride"
                stroke={palette.power}
                strokeWidth={2}
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
