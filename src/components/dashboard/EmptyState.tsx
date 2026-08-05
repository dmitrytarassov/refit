import { deferCall } from "just-defer-call";
import type { ReactElement } from "react";

import "./EmptyState.css";
import { EXAMPLE_FILES } from "./example-files";

interface EmptyStateProps {
  onLoadExample: (url: string, fileName: string) => void;
}

export function EmptyState({ onLoadExample }: EmptyStateProps): ReactElement {
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
      <h2 className="empty-state-title">No file loaded</h2>
      <p className="empty-state-subtitle">
        Upload a .fit file to see your ride analysis.
      </p>
      <div className="empty-state-examples">
        <span className="empty-state-examples-label">Or try an example:</span>
        <div className="empty-state-examples-buttons">
          {EXAMPLE_FILES.map((file) => (
            <button
              key={file.fileName}
              type="button"
              className="empty-state-example-button"
              onClick={deferCall(onLoadExample, file.url, file.fileName)}
            >
              {file.label}
            </button>
          ))}
        </div>
        <span className="empty-state-examples-note">
          Examples are not saved to History.
        </span>
      </div>
    </section>
  );
}
