import "./DashboardPanel.css";
import type { ReactElement } from "react";
import { Suspense, lazy } from "react";

import { EmptyState } from "./EmptyState";

import type { ProcessingState } from "../../types/processing-state";
import type { RideSettings } from "../../types/ride-settings";

const ActivityDashboard = lazy(() =>
  import("./ActivityDashboard").then((m) => ({ default: m.ActivityDashboard })),
);

export function DashboardPanel({
  state,
  onSettingsChange,
  onLoadExample,
  onReset,
  onDiscard,
}: {
  state: ProcessingState;
  onSettingsChange: (settings: RideSettings) => void;
  onLoadExample: (url: string, fileName: string) => void;
  onReset: () => void;
  onDiscard: () => void;
}): ReactElement {
  if (state.status === "idle") {
    return <EmptyState onLoadExample={onLoadExample} />;
  }
  if (state.status === "processing") {
    return <p className="dashboard-processing">Processing {state.fileName}…</p>;
  }
  if (state.status === "error") {
    return (
      <p className="dashboard-error" role="alert">
        {state.message}
      </p>
    );
  }

  return (
    <Suspense
      fallback={<p className="dashboard-processing">Loading dashboard…</p>}
    >
      <ActivityDashboard
        activity={state.activity}
        onSettingsChange={onSettingsChange}
        onReset={onReset}
        onDiscard={onDiscard}
      />
    </Suspense>
  );
}
