import type { ReactElement } from "react";
import { useSearchParams } from "react-router-dom";

import { DashboardTabs } from "./DashboardTabs";
import { DataQualityTab } from "./DataQualityTab";
import { FileHeaderCard } from "./FileHeaderCard";
import { MapTab } from "./MapTab";
import { OverviewTab } from "./OverviewTab";
import { PerformanceTab } from "./PerformanceTab";
import { PowerTab } from "./PowerTab";

import type { Activity } from "../../types/activity";
import type { RideSettings } from "../../types/ride-settings";
import { PowerSettingsBar } from "../power-settings/PowerSettingsBar";

export function ActivityDashboard({
  activity,
  onSettingsChange,
  onReset,
}: {
  activity: Activity;
  onSettingsChange: (settings: RideSettings) => void;
  onReset: () => void;
}): ReactElement {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  let content: ReactElement;
  if (tab === "power") {
    content = <PowerTab activity={activity} />;
  } else if (tab === "performance") {
    content = <PerformanceTab activity={activity} />;
  } else if (tab === "map") {
    content = <MapTab activity={activity} />;
  } else if (tab === "data-quality") {
    content = <DataQualityTab activity={activity} />;
  } else {
    content = <OverviewTab activity={activity} />;
  }

  return (
    <div className="dashboard-panel">
      <FileHeaderCard activity={activity} onReset={onReset} />
      <PowerSettingsBar
        settings={activity.settings}
        onChange={onSettingsChange}
      />
      <DashboardTabs />
      {content}
    </div>
  );
}
