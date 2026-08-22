import type { ReactElement } from "react";

import "./FileDataCard.css";
import { useT } from "../../hooks/use-translation";
import type { Activity } from "../../types/activity";

function formatRawValue(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(String).join(", ");
  }
  if (typeof value === "object" && value != null) {
    return JSON.stringify(value);
  }
  return String(value);
}

export function FileDataCard({
  activity,
}: {
  activity: Activity;
}): ReactElement {
  const { t } = useT();
  const messages = activity.fit.messages as Record<string, unknown>;
  const counts = Object.entries(messages)
    .filter((entry): entry is [string, unknown[]] => Array.isArray(entry[1]))
    .map(([key, list]) => ({ key, count: list.length }))
    .sort((a, b) => b.count - a.count);
  const fileId = (activity.fit.messages.fileIdMesgs?.[0] ?? {}) as Record<
    string,
    unknown
  >;
  const session = (activity.fit.messages.sessionMesgs?.[0] ?? {}) as Record<
    string,
    unknown
  >;
  const errors = activity.fit.errors;

  return (
    <section className="file-data-card">
      <h3>{t.dashboard.rawFileData}</h3>
      {errors.length > 0 && (
        <ul className="file-data-errors">
          {errors.map((error) => (
            <li key={String(error)}>{String(error)}</li>
          ))}
        </ul>
      )}
      <div className="file-data-tables">
        <div className="file-data-column">
          <div>
            <h4>{t.dashboard.messages}</h4>
            <table>
              <tbody>
                {counts.map((row) => (
                  <tr key={row.key}>
                    <td>{row.key}</td>
                    <td>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h4>{t.dashboard.fileId}</h4>
            <table>
              <tbody>
                {Object.entries(fileId).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{formatRawValue(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="file-data-column">
          <div>
            <h4>{t.dashboard.session}</h4>
            <table>
              <tbody>
                {Object.entries(session).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{formatRawValue(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
