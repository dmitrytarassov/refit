import { deferCall } from "just-defer-call";
import type { ReactElement } from "react";
import { useSearchParams } from "react-router-dom";

import "./DashboardTabs.css";

import { useT } from "../../hooks/use-translation";

const TABS = [
  { key: "overview", tKey: "overview", enabled: true },
  { key: "power", tKey: "power", enabled: true },
  { key: "performance", tKey: "performance", enabled: true },
  { key: "intervals", tKey: "intervals", enabled: false },
  { key: "map", tKey: "map", enabled: true },
  { key: "data-quality", tKey: "dataQuality", enabled: true },
] as const;

export function DashboardTabs(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useT();
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
    <nav className="dashboard-tabs" aria-label={t.dashboard.tabs.aria}>
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
            {t.dashboard.tabs[tab.tKey]}
          </button>
        ) : (
          <button
            key={tab.key}
            type="button"
            className="dashboard-tabs-tab"
            aria-disabled="true"
            tabIndex={-1}
          >
            {t.dashboard.tabs[tab.tKey]}
          </button>
        ),
      )}
    </nav>
  );
}
