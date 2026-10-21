import { deferCall } from "just-defer-call";
import { Trash2 } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import type { WorkoutRow } from "../../db/workout-row";
import { formatDuration } from "../../fit/format-metrics";
import { useT } from "../../hooks/use-translation";

interface WorkoutsTableProps {
  workouts: WorkoutRow[];
  armedId: number | null;
  onDelete: (id: number) => void;
}

export function WorkoutsTable({
  workouts,
  armedId,
  onDelete,
}: WorkoutsTableProps): ReactElement {
  const { t } = useT();
  return (
    <table className="workouts-table">
      <thead>
        <tr>
          <th>{t.workouts.headers.date}</th>
          <th>{t.workouts.headers.name}</th>
          <th>{t.workouts.headers.duration}</th>
          <th>{t.workouts.headers.tss}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {workouts.map((row) => {
          const name = row.name === "" ? t.planner.untitled : row.name;
          return (
            <tr key={row.id}>
              <td>
                {new Date(row.updatedAt).toLocaleDateString(t.locale, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td>
                <Link
                  to={`/?view=planner&workout=${row.id}`}
                  className="workouts-link"
                >
                  {name}
                </Link>
              </td>
              <td>{formatDuration(row.durationSec)}</td>
              <td>{row.tss}</td>
              <td className="workouts-actions">
                {row.id != null && (
                  <button
                    type="button"
                    className={
                      armedId === row.id
                        ? "workouts-delete is-armed"
                        : "workouts-delete"
                    }
                    aria-label={
                      armedId === row.id
                        ? t.workouts.confirmDeleteAria(name)
                        : t.workouts.deleteAria(name)
                    }
                    onClick={deferCall(onDelete, row.id)}
                  >
                    {armedId === row.id ? (
                      t.workouts.deleteConfirm
                    ) : (
                      <Trash2 size={15} aria-hidden="true" />
                    )}
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
