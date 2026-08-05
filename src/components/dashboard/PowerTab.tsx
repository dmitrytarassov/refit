import type { ReactElement } from "react";

import { METRIC_HELP } from "./metric-help";
import { MetricTile } from "./ui/MetricTile";
import "./PowerTab.css";

import { useFTP } from "../../hooks/use-ftp";
import { useTSS } from "../../hooks/use-tss";
import type { Activity } from "../../types/activity";
import { PowerCurveCard } from "../bottom/PowerCurveCard";
import { PowerChartCard } from "../charts/PowerChartCard";

export function PowerTab({ activity }: { activity: Activity }): ReactElement {
  const ftp = useFTP(activity);
  const tss = useTSS(activity);
  const stats = activity.powerStats;
  const np = stats?.normalizedPower;
  const intensity = ftp != null && np != null ? np / ftp.watts : null;

  return (
    <>
      <div className="power-tab-tiles">
        <MetricTile
          label="Avg Power"
          value={stats != null ? String(stats.avgPower) : "—"}
          unit="W"
          help={METRIC_HELP.avgPower}
        />
        <MetricTile
          label="Normalized Power"
          value={np != null ? String(np) : "—"}
          unit="W"
          help={METRIC_HELP.normalizedPower}
        />
        <MetricTile
          label="Max Power"
          value={stats != null ? String(stats.maxPower) : "—"}
          unit="W"
          help={METRIC_HELP.maxPower}
        />
        <MetricTile
          label="Est. FTP"
          value={ftp != null ? String(ftp.watts) : "—"}
          unit="W"
          help={METRIC_HELP.ftp}
        />
        <MetricTile
          label="Intensity Factor"
          value={intensity != null ? intensity.toFixed(2) : "—"}
          help={METRIC_HELP.intensityFactor}
        />
        <MetricTile
          label="TSS"
          value={tss != null ? String(Math.round(tss)) : "—"}
          help={METRIC_HELP.tss}
        />
      </div>
      <PowerChartCard activity={activity} />
      <PowerCurveCard activity={activity} />
    </>
  );
}
