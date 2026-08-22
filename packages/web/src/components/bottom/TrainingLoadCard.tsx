import type { ReactElement } from "react";

import "./TrainingLoadCard.css";

export function TrainingLoadCard(): ReactElement {
  return (
    <section className="training-load-card">
      <h3>Training Load</h3>
      <div className="training-load-placeholder">
        <svg viewBox="0 0 32 20" width="32" height="20" aria-hidden="true">
          <path
            d="M4 18v-5M11 18V8M18 18v-8M25 18V3"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>Coming soon</span>
      </div>
    </section>
  );
}
