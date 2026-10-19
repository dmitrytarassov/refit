import type { ReactElement } from "react";

import { useActivitySummary } from "../../hooks/use-activity-summary";
import type { Activity } from "../../types/activity";
import { PowerCurveCard } from "../bottom/PowerCurveCard";
import { MetricTilesRow } from "../dashboard/MetricTilesRow";
import "./CompareRideContent.css";

interface CompareRideContentProps {
  activity: Activity;
}

export function CompareRideContent({
  activity,
}: CompareRideContentProps): ReactElement {
  const { meta } = useActivitySummary(activity);
  const metaParts = [meta.sport, meta.dateLabel, meta.deviceLabel].filter(
    (part): part is string => part != null,
  );

  return (
    <div className="compare-ride-content">
      <header className="compare-ride-header">
        <h3 className="compare-ride-name" title={activity.fileName}>
          {activity.fileName}
        </h3>
        {metaParts.length > 0 && (
          <p className="compare-ride-meta">{metaParts.join(" · ")}</p>
        )}
      </header>
      <MetricTilesRow activity={activity} />
      <PowerCurveCard activity={activity} syncId="compare" />
    </div>
  );
}
