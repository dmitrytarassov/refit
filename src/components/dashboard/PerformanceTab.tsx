import type { ReactElement } from "react";

import type { Activity } from "../../types/activity";
import { TrainingLoadCard } from "../bottom/TrainingLoadCard";
import { CadenceChartCard } from "../charts/CadenceChartCard";
import { ElevationChartCard } from "../charts/ElevationChartCard";
import { HeartRateChartCard } from "../charts/HeartRateChartCard";

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
      <TrainingLoadCard />
    </>
  );
}
