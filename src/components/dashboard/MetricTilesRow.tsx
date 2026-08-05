import type { ReactElement } from "react";

import { METRIC_HELP } from "./metric-help";
import { MetricTile } from "./ui/MetricTile";

import { useActivitySummary } from "../../hooks/use-activity-summary";
import { useFTP } from "../../hooks/use-ftp";
import { useTSS } from "../../hooks/use-tss";
import type { Activity } from "../../types/activity";
import "./MetricTilesRow.css";

interface MetricTilesRowProps {
  activity: Activity;
}

export function MetricTilesRow({
  activity,
}: MetricTilesRowProps): ReactElement {
  const { metrics } = useActivitySummary(activity);
  const ftp = useFTP(activity);
  const tss = useTSS(activity);
  const [distanceValue = "0.0", distanceUnit = "km"] =
    metrics.distanceLabel.split(" ");

  return (
    <section className="metric-tiles-row" aria-label="Ride metrics">
      <MetricTile label="Duration" value={metrics.durationLabel} />
      <MetricTile label="Distance" value={distanceValue} unit={distanceUnit} />
      <MetricTile
        label="Avg Power"
        value={metrics.avgPower != null ? String(metrics.avgPower) : "—"}
        unit={metrics.avgPower != null ? "W" : undefined}
        muted={metrics.avgPower == null}
        help={METRIC_HELP.avgPower}
      />
      <MetricTile
        label="Normalized Power"
        value={
          metrics.normalizedPower != null
            ? String(metrics.normalizedPower)
            : "—"
        }
        unit={metrics.normalizedPower != null ? "W" : undefined}
        muted={metrics.normalizedPower == null}
        help={METRIC_HELP.normalizedPower}
      />
      <MetricTile
        label={ftp?.source === "manual" ? "FTP (manual)" : "Est. FTP"}
        value={ftp != null ? String(ftp.watts) : "—"}
        unit={ftp != null ? "W" : undefined}
        muted={ftp == null}
        help={
          ftp?.source === "manual" ? METRIC_HELP.ftpManual : METRIC_HELP.ftp
        }
      />
      <MetricTile
        label="TSS"
        value={tss != null ? String(tss) : "—"}
        muted={tss == null}
        help={METRIC_HELP.tss}
      />
    </section>
  );
}
