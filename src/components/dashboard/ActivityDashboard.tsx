import type { ReactElement } from "react";
import { useSearchParams } from "react-router-dom";

import { DashboardTabs } from "./DashboardTabs";
import { DataQualityTab } from "./DataQualityTab";
import { DefaultMassAlert } from "./DefaultMassAlert";
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
  onDiscard,
}: {
  activity: Activity;
  onSettingsChange: (settings: RideSettings) => void;
  onReset: () => void;
  onDiscard: () => void;
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
      <FileHeaderCard
        activity={activity}
        onReset={onReset}
        onDiscard={onDiscard}
      />
      <PowerSettingsBar
        settings={activity.settings}
        onChange={onSettingsChange}
      />
      <DefaultMassAlert />
      <DashboardTabs />
      {content}
    </div>
  );
}
