import "./HistoryRideCard.css";
import { shortenString } from "just-shorten";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { RouteThumb } from "./RouteThumb";

import type { RideRow } from "../../db/ride-row";
import { formatDistance } from "../../fit/format-metrics";
import { formatSpeed } from "../../fit/format-speed";
import { useT } from "../../hooks/use-translation";

interface HistoryRideCardProps {
  ride: Omit<RideRow, "file">;
}

export function HistoryRideCard({ ride }: HistoryRideCardProps): ReactElement {
  const { t } = useT();
  const created = new Date(ride.createdAt);

  return (
    <Link to={`/?record=${ride.id}`} className="history-ride-card">
      <RouteThumb track={ride.track} />
      <div className="history-ride-card-body">
        <h3 className="history-ride-card-name">
          {shortenString(ride.fileName, 6)}
        </h3>
        <p className="history-ride-card-date">
          {created.toLocaleDateString(t.locale, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          {" · "}
          {created.toLocaleTimeString(t.locale, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="history-ride-card-stats">
          <span>{formatDistance(ride.distanceM, t.common.units.km)}</span>
          <span>
            {formatSpeed(ride.distanceM, ride.durationSec, t.common.units.kmh)}
          </span>
          <span>
            {ride.avgPower != null
              ? `${ride.avgPower} ${t.common.units.w}`
              : `— ${t.common.units.w}`}
          </span>
        </p>
      </div>
    </Link>
  );
}
