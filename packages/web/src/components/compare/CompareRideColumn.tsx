import type { ReactElement } from "react";

import { CompareRideContent } from "./CompareRideContent";

import { useRideActivity } from "../../hooks/use-ride-activity";
import { useT } from "../../hooks/use-translation";

interface CompareRideColumnProps {
  id: number;
}

export function CompareRideColumn({
  id,
}: CompareRideColumnProps): ReactElement {
  const { t } = useT();
  const state = useRideActivity(id);

  if (state.status === "error") {
    return (
      <p className="compare-status compare-error" role="alert">
        {state.message}
      </p>
    );
  }
  if (state.status !== "ready") {
    return <p className="compare-status">{t.common.loading}</p>;
  }
  return <CompareRideContent activity={state.activity} />;
}
