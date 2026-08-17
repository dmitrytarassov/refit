import { deferCall } from "just-defer-call";
import { shortenString } from "just-shorten";
import { Trash2 } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import type { RideRow } from "../../db/ride-row";
import { formatDistance, formatDuration } from "../../fit/format-metrics";

interface HistoryTableProps {
  rides: Array<Omit<RideRow, "file">>;
  armedId: number | null;
  onDelete: (id: number) => void;
}

export function HistoryTable({
  rides,
  armedId,
  onDelete,
}: HistoryTableProps): ReactElement {
  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>File</th>
          <th>Duration</th>
          <th>Distance</th>
          <th>Avg Power</th>
          <th>Normalized Power</th>
          <th>Est. FTP</th>
          <th>TSS</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {rides.map((ride) => (
          <tr key={ride.id}>
            <td>
              {new Date(ride.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </td>
            <td>
              <Link to={`/?record=${ride.id}`} className="history-ride-link">
                {shortenString(ride.fileName, 12)}
              </Link>
            </td>
            <td>{formatDuration(ride.durationSec)}</td>
            <td>{formatDistance(ride.distanceM)}</td>
            <td>{ride.avgPower != null ? `${ride.avgPower} W` : "—"}</td>
            <td>
              {ride.normalizedPower != null ? `${ride.normalizedPower} W` : "—"}
            </td>
            <td>{ride.ftpWatts != null ? `${ride.ftpWatts} W` : "—"}</td>
            <td>{ride.tss ?? "—"}</td>
            <td>
              {ride.id != null && (
                <button
                  type="button"
                  className={
                    armedId === ride.id
                      ? "history-delete is-armed"
                      : "history-delete"
                  }
                  aria-label={
                    armedId === ride.id
                      ? `Confirm deleting ${ride.fileName}`
                      : `Delete ${ride.fileName}`
                  }
                  onClick={deferCall(onDelete, ride.id)}
                >
                  {armedId === ride.id ? (
                    "Delete?"
                  ) : (
                    <Trash2 size={15} aria-hidden="true" />
                  )}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
