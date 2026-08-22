import { deferCall } from "just-defer-call";
import { shortenString } from "just-shorten";
import { Trash2 } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import type { RideRow } from "../../db/ride-row";
import { formatDistance, formatDuration } from "../../fit/format-metrics";
import { useT } from "../../hooks/use-translation";

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
  const { t } = useT();
  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>{t.history.headers.date}</th>
          <th>{t.history.headers.file}</th>
          <th>{t.history.headers.duration}</th>
          <th>{t.history.headers.distance}</th>
          <th>{t.history.headers.avgPower}</th>
          <th>{t.history.headers.normalizedPower}</th>
          <th>{t.history.headers.estFtp}</th>
          <th>{t.history.headers.tss}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {rides.map((ride) => (
          <tr key={ride.id}>
            <td>
              {new Date(ride.createdAt).toLocaleDateString(t.locale, {
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
            <td>{formatDistance(ride.distanceM, t.common.units.km)}</td>
            <td>
              {ride.avgPower != null
                ? `${ride.avgPower} ${t.common.units.w}`
                : "—"}
            </td>
            <td>
              {ride.normalizedPower != null
                ? `${ride.normalizedPower} ${t.common.units.w}`
                : "—"}
            </td>
            <td>
              {ride.ftpWatts != null
                ? `${ride.ftpWatts} ${t.common.units.w}`
                : "—"}
            </td>
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
                      ? t.history.confirmDeleteAria(ride.fileName)
                      : t.history.deleteAria(ride.fileName)
                  }
                  onClick={deferCall(onDelete, ride.id)}
                >
                  {armedId === ride.id ? (
                    t.history.deleteConfirm
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
