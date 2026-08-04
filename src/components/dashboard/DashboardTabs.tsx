import type { ReactElement } from "react";

import "./DashboardTabs.css";

export function DashboardTabs(): ReactElement {
  return (
    <nav className="dashboard-tabs" aria-label="Dashboard sections">
      <button
        type="button"
        className="dashboard-tabs-tab dashboard-tabs-active"
        aria-current="page"
      >
        Overview
      </button>
      {["Power", "Performance", "Intervals", "Map", "Data Quality"].map(
        (label) => (
          <button
            key={label}
            type="button"
            className="dashboard-tabs-tab"
            aria-disabled="true"
            tabIndex={-1}
          >
            {label}
          </button>
        ),
      )}
    </nav>
  );
}
