import type { ReactElement } from "react";

import { useFTP } from "../../hooks/use-ftp";
import { usePowerZones } from "../../hooks/use-power-zones";
import { useT } from "../../hooks/use-translation";
import type { Activity } from "../../types/activity";
import "./PowerZonesPanel.css";

interface PowerZonesPanelProps {
  activity: Activity;
}

export function PowerZonesPanel({
  activity,
}: PowerZonesPanelProps): ReactElement {
  const { t } = useT();
  const ftp = useFTP(activity);
  const zones = usePowerZones(activity);
  const maxSeconds = Math.max(...zones.map((z) => z.seconds), 1);

  return (
    <aside className="power-zones-panel">
      <header className="power-zones-header">
        <h3>{t.charts.titles.powerZones}</h3>
        <span className="power-zones-caption">
          {ftp != null
            ? t.charts.ftpAt(
                ftp.watts,
                ftp.source === "manual"
                  ? t.charts.ftpSourceManual
                  : t.charts.ftpSourceEstimated,
              )
            : t.charts.noData.power}
        </span>
      </header>
      <ul>
        {[...zones].reverse().map((zone, i) => (
          <li key={zone.zone}>
            <span className="power-zone-label">{zone.zone}</span>
            <span className="power-zone-bar">
              <span
                className="power-zone-fill"
                style={{
                  width: `${(zone.seconds / maxSeconds) * 100}%`,
                  opacity: 0.25 + i * 0.11,
                }}
              />
            </span>
            <span className="power-zone-value">
              {Math.round(zone.fraction * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
