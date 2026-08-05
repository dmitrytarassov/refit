import { deferCall } from "just-defer-call";
import type { ReactElement } from "react";
import { useSearchParams } from "react-router-dom";

import "./DashboardTabs.css";

const TABS = [
  { key: "overview", label: "Overview", enabled: true },
  { key: "power", label: "Power", enabled: true },
  { key: "performance", label: "Performance", enabled: true },
  { key: "intervals", label: "Intervals", enabled: false },
  { key: "map", label: "Map", enabled: true },
  { key: "data-quality", label: "Data Quality", enabled: true },
] as const;

export function DashboardTabs(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get("tab") ?? "overview";

  const select = (key: string): void => {
    const next = new URLSearchParams(searchParams);
    if (key === "overview") {
      next.delete("tab");
    } else {
      next.set("tab", key);
    }
    setSearchParams(next);
  };

  return (
    <nav className="dashboard-tabs" aria-label="Dashboard sections">
      {TABS.map((tab) =>
        tab.enabled ? (
          <button
            key={tab.key}
            type="button"
            className={
              active === tab.key
                ? "dashboard-tabs-tab dashboard-tabs-active"
                : "dashboard-tabs-tab"
            }
            aria-current={active === tab.key ? "page" : undefined}
            onClick={deferCall(select, tab.key)}
          >
            {tab.label}
          </button>
        ) : (
          <button
            key={tab.key}
            type="button"
            className="dashboard-tabs-tab"
            aria-disabled="true"
            tabIndex={-1}
          >
            {tab.label}
          </button>
        ),
      )}
    </nav>
  );
}
