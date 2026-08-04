import type { ReactElement } from "react";
import { Suspense, lazy } from "react";

import { DashboardTabs } from "./DashboardTabs";
import { FileHeaderCard } from "./FileHeaderCard";
import { MetricTilesRow } from "./MetricTilesRow";

import type { Activity } from "../../types/activity";
import type { RideSettings } from "../../types/ride-settings";
import { DataQualityCard } from "../bottom/DataQualityCard";
import { PowerCurveCard } from "../bottom/PowerCurveCard";
import { TrainingLoadCard } from "../bottom/TrainingLoadCard";
import { CadenceChartCard } from "../charts/CadenceChartCard";
import { ElevationChartCard } from "../charts/ElevationChartCard";
import { HeartRateChartCard } from "../charts/HeartRateChartCard";
import { PowerChartCard } from "../charts/PowerChartCard";
import { PowerSettingsBar } from "../power-settings/PowerSettingsBar";

const RouteMapCard = lazy(() =>
  import("../map/RouteMapCard").then((m) => ({ default: m.RouteMapCard })),
);

export function ActivityDashboard({
  activity,
  onSettingsChange,
}: {
  activity: Activity;
  onSettingsChange: (settings: RideSettings) => void;
}): ReactElement {
  return (
    <div className="dashboard-panel">
      <FileHeaderCard activity={activity} />
      <PowerSettingsBar
        settings={activity.settings}
        onChange={onSettingsChange}
      />
      <DashboardTabs />
      <MetricTilesRow activity={activity} />
      <PowerChartCard activity={activity} />
      <div className="dashboard-mid-row">
        <HeartRateChartCard activity={activity} />
        <CadenceChartCard activity={activity} />
        <ElevationChartCard activity={activity} />
      </div>
      <div className="dashboard-bottom-row">
        <PowerCurveCard activity={activity} />
        <TrainingLoadCard />
        <DataQualityCard activity={activity} />
      </div>
      <Suspense fallback={null}>
        <RouteMapCard activity={activity} />
      </Suspense>
    </div>
  );
}
