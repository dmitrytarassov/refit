import type { ReactElement } from "react";
import { Suspense, lazy } from "react";

import { MetricTilesRow } from "./MetricTilesRow";

import type { Activity } from "../../types/activity";
import { DataQualityCard } from "../bottom/DataQualityCard";
import { PowerCurveCard } from "../bottom/PowerCurveCard";
import { CadenceChartCard } from "../charts/CadenceChartCard";
import { ElevationChartCard } from "../charts/ElevationChartCard";
import { HeartRateChartCard } from "../charts/HeartRateChartCard";
import { PowerChartCard } from "../charts/PowerChartCard";
import { SpeedChartCard } from "../charts/SpeedChartCard";

const RouteMapCard = lazy(() =>
  import("../map/RouteMapCard").then((m) => ({ default: m.RouteMapCard })),
);

export function OverviewTab({
  activity,
}: {
  activity: Activity;
}): ReactElement {
  return (
    <>
      <MetricTilesRow activity={activity} />
      <PowerChartCard activity={activity} />
      <div className="dashboard-card-grid">
        <HeartRateChartCard activity={activity} />
        <CadenceChartCard activity={activity} />
        <ElevationChartCard activity={activity} />
        <PowerCurveCard activity={activity} />
        <SpeedChartCard activity={activity} />
        <DataQualityCard activity={activity} />
      </div>
      <Suspense fallback={null}>
        <RouteMapCard activity={activity} />
      </Suspense>
    </>
  );
}
