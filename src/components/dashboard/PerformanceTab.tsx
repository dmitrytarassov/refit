import type { ReactElement } from "react";

import type { Activity } from "../../types/activity";
import { CadenceChartCard } from "../charts/CadenceChartCard";
import { ElevationChartCard } from "../charts/ElevationChartCard";
import { HeartRateChartCard } from "../charts/HeartRateChartCard";
import { SpeedChartCard } from "../charts/SpeedChartCard";

export function PerformanceTab({
  activity,
}: {
  activity: Activity;
}): ReactElement {
  return (
    <>
      <HeartRateChartCard activity={activity} />
      <CadenceChartCard activity={activity} />
      <ElevationChartCard activity={activity} />
      <SpeedChartCard activity={activity} />
    </>
  );
}
