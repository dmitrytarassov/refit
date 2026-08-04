import type { ReactElement } from "react";

import { useFTP } from "../../hooks/use-ftp";
import { usePowerZones } from "../../hooks/use-power-zones";
import type { Activity } from "../../types/activity";
import "./PowerZonesPanel.css";

interface PowerZonesPanelProps {
  activity: Activity;
}

export function PowerZonesPanel({
  activity,
}: PowerZonesPanelProps): ReactElement {
  const ftp = useFTP(activity);
  const zones = usePowerZones(activity);
  const maxSeconds = Math.max(...zones.map((z) => z.seconds), 1);

  return (
    <aside className="power-zones-panel">
      <header className="power-zones-header">
        <h3>Power Zones</h3>
        <span className="power-zones-caption">
          {ftp != null ? `@ FTP ${ftp.watts} W` : "No power data"}
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
