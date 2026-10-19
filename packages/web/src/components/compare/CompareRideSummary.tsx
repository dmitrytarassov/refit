import { shortenString } from "just-shorten";
import type { ReactElement } from "react";

import type { RideRow } from "../../db/ride-row";
import { formatDistance, formatDuration } from "../../fit/format-metrics";
import { useT } from "../../hooks/use-translation";
import "./CompareRideSummary.css";

interface CompareRideSummaryProps {
  ride: Omit<RideRow, "file">;
}

/** One ride as a list entry: file name, date · time, duration / distance / power. */
export function CompareRideSummary({
  ride,
}: CompareRideSummaryProps): ReactElement {
  const { t } = useT();
  const created = new Date(ride.createdAt);
  const watts = (value: number | undefined): string =>
    value != null ? `${value} ${t.common.units.w}` : "—";

  return (
    <span className="compare-ride-summary">
      <span className="compare-ride-summary-name">
        {shortenString(ride.fileName, 12)}
      </span>
      <span className="compare-ride-summary-date">
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
      </span>
      <span className="compare-ride-summary-stats">
        <span>{formatDuration(ride.durationSec)}</span>
        <span>{formatDistance(ride.distanceM, t.common.units.km)}</span>
        <span>{watts(ride.avgPower)}</span>
        <span>NP {watts(ride.normalizedPower)}</span>
      </span>
    </span>
  );
}
