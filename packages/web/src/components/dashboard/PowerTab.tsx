import type { ReactElement } from "react";

import { MetricTile } from "./ui/MetricTile";
import "./PowerTab.css";

import { useFTP } from "../../hooks/use-ftp";
import { useT } from "../../hooks/use-translation";
import { useTSS } from "../../hooks/use-tss";
import type { Activity } from "../../types/activity";
import { PowerCurveCard } from "../bottom/PowerCurveCard";
import { PowerChartCard } from "../charts/PowerChartCard";

export function PowerTab({ activity }: { activity: Activity }): ReactElement {
  const { t } = useT();
  const ftp = useFTP(activity);
  const tss = useTSS(activity);
  const stats = activity.powerStats;
  const np = stats?.normalizedPower;
  const intensity = ftp != null && np != null ? np / ftp.watts : null;

  return (
    <>
      <div className="power-tab-tiles">
        <MetricTile
          label={t.dashboard.tiles.avgPower}
          value={stats != null ? String(stats.avgPower) : "—"}
          unit={t.common.units.w}
          help={t.metricHelp.avgPower}
        />
        <MetricTile
          label={t.dashboard.tiles.normalizedPower}
          value={np != null ? String(np) : "—"}
          unit={t.common.units.w}
          help={t.metricHelp.normalizedPower}
        />
        <MetricTile
          label={t.dashboard.tiles.maxPower}
          value={stats != null ? String(stats.maxPower) : "—"}
          unit={t.common.units.w}
          help={t.metricHelp.maxPower}
        />
        <MetricTile
          label={
            ftp?.source === "manual"
              ? t.dashboard.tiles.ftpManual
              : t.dashboard.tiles.estFtp
          }
          value={ftp != null ? String(ftp.watts) : "—"}
          unit={t.common.units.w}
          help={
            ftp?.source === "manual" ? t.metricHelp.ftpManual : t.metricHelp.ftp
          }
        />
        <MetricTile
          label={t.dashboard.tiles.intensityFactor}
          value={intensity != null ? intensity.toFixed(2) : "—"}
          help={t.metricHelp.intensityFactor}
        />
        <MetricTile
          label={t.dashboard.tiles.tss}
          value={tss != null ? String(Math.round(tss)) : "—"}
          help={t.metricHelp.tss}
        />
      </div>
      <PowerChartCard activity={activity} />
      <PowerCurveCard activity={activity} />
    </>
  );
}
