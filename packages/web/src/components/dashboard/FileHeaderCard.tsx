import type { ReactElement } from "react";
import { useSearchParams } from "react-router-dom";

import { ClearButton } from "./ClearButton";
import { DownloadMenu } from "./DownloadMenu";

import { useActivitySummary } from "../../hooks/use-activity-summary";
import { useT } from "../../hooks/use-translation";
import type { Activity } from "../../types/activity";
import { ShareButton } from "../share/ShareButton";
import "./FileHeaderCard.css";

interface FileHeaderCardProps {
  activity: Activity;
  onTitleChange: (title: string) => void;
  onReset: () => void;
  onDiscard: () => void;
}

export function FileHeaderCard({
  activity,
  onTitleChange,
  onReset,
  onDiscard,
}: FileHeaderCardProps): ReactElement {
  const { t } = useT();
  const { meta } = useActivitySummary(activity);
  const [searchParams, setSearchParams] = useSearchParams();
  const openRawData = (): void => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", "data-quality");
    setSearchParams(next);
  };
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
        <button
          type="button"
          className="file-header-card-secondary"
          onClick={openRawData}
        >
          {t.dashboard.viewRawData}
        </button>
        <ShareButton activity={activity} onTitleChange={onTitleChange} />
        <DownloadMenu key={activity.fileName} activity={activity} />
        <ClearButton onReset={onReset} onDiscard={onDiscard} />
      </div>
    </section>
  );
}
