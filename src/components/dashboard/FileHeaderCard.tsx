import type { ReactElement } from "react";

import { useActivitySummary } from "../../hooks/use-activity-summary";
import { useEnhanceDownload } from "../../hooks/use-enhance-download";
import type { Activity } from "../../types/activity";
import "./FileHeaderCard.css";

interface FileHeaderCardProps {
  activity: Activity;
}

export function FileHeaderCard({
  activity,
}: FileHeaderCardProps): ReactElement {
  const { meta } = useActivitySummary(activity);
  const download = useEnhanceDownload(activity);
  const metaParts = [meta.sport, meta.dateLabel, meta.deviceLabel].filter(
    (part): part is string => part != null,
  );

  return (
    <section className="file-header-card">
      <div className="file-header-card-info">
        <span className="file-header-card-chip" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <div className="file-header-card-text">
          <h2 className="file-header-card-name">{activity.fileName}</h2>
          {metaParts.length > 0 && (
            <p className="file-header-card-meta">{metaParts.join(" · ")}</p>
          )}
        </div>
      </div>
      <div className="file-header-card-actions">
        <button type="button" className="file-header-card-secondary">
          View Raw Data
        </button>
        <button
          type="button"
          className="file-header-card-primary"
          onClick={download}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M4 19h16" />
          </svg>
          Enhance &amp; Download
        </button>
        <button
          type="button"
          className="file-header-card-kebab"
          aria-label="More options"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="12" cy="5" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="12" cy="19" r="1.8" />
          </svg>
        </button>
      </div>
    </section>
  );
}
