import { deferCall } from "just-defer-call";
import { Trash2 } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { formatDistance, formatDuration } from "../../fit/format-metrics";
import { useRideHistory } from "../../hooks/use-ride-history";
import "./HistoryPage.css";

export function HistoryPage(): ReactElement {
  const { rides, loading, remove } = useRideHistory();
  const [armedId, setArmedId] = useState<number | null>(null);

  const handleDelete = (id: number): void => {
    if (armedId === id) {
      setArmedId(null);
      remove(id);
    } else {
      setArmedId(id);
    }
  };

  let body: ReactElement;
  if (loading) {
    body = <p className="history-empty">Loading…</p>;
  } else if (rides.length === 0) {
    body = (
      <p className="history-empty">
        No saved rides yet — process a .fit file on the Dashboard.
      </p>
    );
  } else {
    body = (
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
                  {ride.fileName}
                </Link>
              </td>
              <td>{formatDuration(ride.durationSec)}</td>
              <td>{formatDistance(ride.distanceM)}</td>
              <td>{ride.avgPower != null ? `${ride.avgPower} W` : "—"}</td>
              <td>
                {ride.normalizedPower != null
                  ? `${ride.normalizedPower} W`
                  : "—"}
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
                    onClick={deferCall(handleDelete, ride.id)}
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

  return (
    <section className="history-page">
      <h2>History</h2>
      {body}
    </section>
  );
}
