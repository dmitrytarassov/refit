import type { ReactElement } from "react";
import { useState } from "react";
import {
  Area,
  Brush,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartFillGradient } from "./ui/ChartFillGradient";
import { ChartTooltip } from "./ui/ChartTooltip";
import "./CombinedChart.css";

import { CHART_PALETTE } from "../../charts/chart-palette";
import { COMBINED_METRICS } from "../../charts/combined-metrics";
import { formatDuration } from "../../fit/format-metrics";
import { useCombinedSeries } from "../../hooks/use-combined-series";
import { useDragZoom } from "../../hooks/use-drag-zoom";
import { useIsMobile } from "../../hooks/use-is-mobile";
import { useTheme } from "../../hooks/use-theme";
import { useT } from "../../hooks/use-translation";
import type { Activity } from "../../types/activity";
import type { CombinedMetricKey } from "../../types/combined-point";

const activeLabelOf = (state: unknown): number | null => {
  const label = (state as { activeLabel?: unknown } | null)?.activeLabel;
  const n = Number(label);
  return label != null && Number.isFinite(n) ? n : null;
};

export function CombinedChart({
  activity,
  initial,
}: {
  activity: Activity;
  initial: CombinedMetricKey;
}): ReactElement {
  const { t } = useT();
  const points = useCombinedSeries(activity);
  const { mode } = useTheme();
  const palette = CHART_PALETTE[mode];
  const zoom = useDragZoom();
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState<Record<string, boolean>>(() => ({
    [initial]: true,
  }));

  const units = Object.fromEntries(
    COMBINED_METRICS.map((m) => [m.key, t.common.units[m.unitKey]]),
  );
  const axisWidth = isMobile ? 52 : 64;

  return (
    <div className="combined-chart">
      {zoom.domain != null && (
        <button
          type="button"
          className="combined-chart-reset"
          onClick={zoom.reset}
        >
          {t.charts.resetZoom}
        </button>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={points}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          onMouseDown={(state) => {
            const label = activeLabelOf(state);
            if (label != null) {
              zoom.onDown(label);
            }
          }}
          onMouseMove={(state) => {
            const label = activeLabelOf(state);
            if (label != null) {
              zoom.onMove(label);
            }
          }}
          onMouseUp={zoom.onUp}
          onMouseLeave={zoom.onUp}
        >
          <defs>
            {COMBINED_METRICS.filter((m) => m.gradient).map((m) => (
              <ChartFillGradient
                key={m.key}
                id={`combined-${m.key}-fill`}
                color={palette[m.paletteKey]}
              />
            ))}
          </defs>
          <CartesianGrid
            vertical={false}
            stroke={palette.grid}
            strokeWidth={1}
          />
          <XAxis
            dataKey="t"
            type="number"
            domain={zoom.domain ?? ["dataMin", "dataMax"]}
            allowDataOverflow
            tickFormatter={(t) => formatDuration(Number(t))}
            tick={{ fill: palette.axis, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            minTickGap={32}
          />
          {COMBINED_METRICS.map((m) => (
            <YAxis
              key={m.key}
              yAxisId={m.key}
              hide={m.key !== initial}
              unit={` ${t.common.units[m.unitKey]}`}
              width={m.key !== initial ? 0 : axisWidth}
              tick={{ fill: palette.axis, fontSize: isMobile ? 10 : 12 }}
              tickLine={false}
              axisLine={false}
            />
          ))}
          <Tooltip
            content={(props) => <ChartTooltip {...props} units={units} />}
            cursor={{ stroke: palette.grid }}
          />
          <Legend
            onClick={(item) => {
              const key = String(item.dataKey);
              setVisible((v) => ({ ...v, [key]: !v[key] }));
            }}
            formatter={(value, entry) => (
              <span
                className={
                  visible[String(entry.dataKey)]
                    ? "combined-chart-legend-item"
                    : "combined-chart-legend-item is-off"
                }
              >
                {value}
              </span>
            )}
          />
          {zoom.refArea != null && (
            <ReferenceArea
              yAxisId={initial}
              x1={zoom.refArea[0]}
              x2={zoom.refArea[1]}
              fill={palette.axis}
              fillOpacity={0.15}
            />
          )}
          {COMBINED_METRICS.map((m) =>
            m.gradient ? (
              <Area
                key={m.key}
                dataKey={m.key}
                yAxisId={m.key}
                name={t.charts.titles[m.key]}
                hide={!visible[m.key]}
                stroke={palette[m.paletteKey]}
                strokeWidth={m.key === initial ? 2 : 1.5}
                fill={`url(#combined-${m.key}-fill)`}
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
            ) : (
              <Line
                key={m.key}
                dataKey={m.key}
                yAxisId={m.key}
                name={t.charts.titles[m.key]}
                hide={!visible[m.key]}
                stroke={palette[m.paletteKey]}
                strokeWidth={m.key === initial ? 2 : 1.5}
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
            ),
          )}
          {isMobile && (
            <Brush
              dataKey="t"
              height={28}
              travellerWidth={12}
              stroke={palette.axis}
              fill="transparent"
              tickFormatter={(t) => formatDuration(Number(t))}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
