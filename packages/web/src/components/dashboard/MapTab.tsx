import type { ReactElement } from "react";
import { Suspense, lazy } from "react";

import type { Activity } from "../../types/activity";

const RouteMapCard = lazy(() =>
  import("../map/RouteMapCard").then((m) => ({ default: m.RouteMapCard })),
);

export function MapTab({ activity }: { activity: Activity }): ReactElement {
  return (
    <Suspense fallback={null}>
      <RouteMapCard activity={activity} />
    </Suspense>
  );
}
