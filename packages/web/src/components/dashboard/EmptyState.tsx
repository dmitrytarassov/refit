import { deferCall } from "just-defer-call";
import type { ReactElement } from "react";

import "./EmptyState.css";
import { EXAMPLE_FILES } from "./example-files";

import { useT } from "../../hooks/use-translation";

interface EmptyStateProps {
  onLoadExample: (url: string, fileName: string) => void;
}

export function EmptyState({ onLoadExample }: EmptyStateProps): ReactElement {
  const { t } = useT();
  return (
    <section className="empty-state">
      <svg
        className="empty-state-icon"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 15h2l1.5-4 2 6 1.5-3h1" />
      </svg>
      <h2 className="empty-state-title">{t.dashboard.empty.title}</h2>
      <p className="empty-state-subtitle">{t.dashboard.empty.subtitle}</p>
      <div className="empty-state-examples">
        <span className="empty-state-examples-label">
          {t.dashboard.empty.tryExample}
        </span>
        <div className="empty-state-examples-buttons">
          {EXAMPLE_FILES.map((file) => (
            <button
              key={file.fileName}
              type="button"
              className="empty-state-example-button"
              onClick={deferCall(onLoadExample, file.url, file.fileName)}
            >
              {t.dashboard.empty[file.labelKey]}
            </button>
          ))}
        </div>
        <span className="empty-state-examples-note">
          {t.dashboard.empty.notSaved}
        </span>
      </div>
    </section>
  );
}
