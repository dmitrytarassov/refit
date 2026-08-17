import type { ReactElement } from "react";

import { MetricTile } from "./ui/MetricTile";

import { useActivitySummary } from "../../hooks/use-activity-summary";
import { useFTP } from "../../hooks/use-ftp";
import { useT } from "../../hooks/use-translation";
import { useTSS } from "../../hooks/use-tss";
import type { Activity } from "../../types/activity";
import "./MetricTilesRow.css";

interface MetricTilesRowProps {
  activity: Activity;
}

export function MetricTilesRow({
  activity,
}: MetricTilesRowProps): ReactElement {
  const { t } = useT();
  const { metrics } = useActivitySummary(activity);
  const ftp = useFTP(activity);
  const tss = useTSS(activity);
  const [distanceValue = "0.0", distanceUnit = "km"] =
    metrics.distanceLabel.split(" ");

  return (
    <section className="metric-tiles-row" aria-label={t.dashboard.tiles.aria}>
      <MetricTile
        label={t.dashboard.tiles.movingTime}
        value={metrics.movingLabel}
        corner={metrics.durationLabel}
      />
      <MetricTile
        label={t.dashboard.tiles.distance}
        value={distanceValue}
        unit={distanceUnit === "km" ? t.common.units.km : distanceUnit}
      />
      <MetricTile
        label={t.dashboard.tiles.avgPower}
        value={metrics.avgPower != null ? String(metrics.avgPower) : "—"}
        unit={metrics.avgPower != null ? t.common.units.w : undefined}
        muted={metrics.avgPower == null}
        help={t.metricHelp.avgPower}
      />
      <MetricTile
        label={t.dashboard.tiles.normalizedPower}
        value={
          metrics.normalizedPower != null
            ? String(metrics.normalizedPower)
            : "—"
        }
        unit={metrics.normalizedPower != null ? t.common.units.w : undefined}
        muted={metrics.normalizedPower == null}
        help={t.metricHelp.normalizedPower}
      />
      <MetricTile
        label={
          ftp?.source === "manual"
            ? t.dashboard.tiles.ftpManual
            : t.dashboard.tiles.estFtp
        }
        value={ftp != null ? String(ftp.watts) : "—"}
        unit={ftp != null ? t.common.units.w : undefined}
        muted={ftp == null}
        help={
          ftp?.source === "manual" ? t.metricHelp.ftpManual : t.metricHelp.ftp
        }
      />
      <MetricTile
        label={t.dashboard.tiles.tss}
        value={tss != null ? String(tss) : "—"}
        muted={tss == null}
        help={t.metricHelp.tss}
      />
    </section>
  );
}
