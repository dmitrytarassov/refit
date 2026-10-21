import type { ReactElement } from "react";
import { Suspense } from "react";
import { useSearchParams } from "react-router-dom";

import { DashboardPanel } from "./components/dashboard/DashboardPanel";
import { HelpPage } from "./components/help/HelpPage";
import { HistoryPage } from "./components/history/HistoryPage";
import { AppHeader } from "./components/layout/AppHeader";
import { MobileNav } from "./components/layout/MobileNav";
import { ComparePage, PlannerPage } from "./components/lazy-pages";
import { SettingsPage } from "./components/settings/SettingsPage";
import { SidebarInfoCards } from "./components/sidebar/SidebarInfoCards";
import { SidebarPanel } from "./components/sidebar/SidebarPanel";
import { WorkoutsPage } from "./components/workouts/WorkoutsPage";
import { useFitProcessing } from "./hooks/use-fit-processing";
import { useT } from "./hooks/use-translation";

export function AppContent(): ReactElement {
  const {
    state,
    processFile,
    processUrl,
    updateSettings,
    updateTitle,
    reset,
    discard,
  } = useFitProcessing();
  const { t } = useT();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  let activeView: "dashboard" | "history" | "planner" | "help" | "settings" =
    "dashboard";
  if (view === "history" || view === "compare") {
    activeView = "history";
  } else if (view === "planner" || view === "workouts") {
    activeView = "planner";
  } else if (view === "help" || view === "settings") {
    activeView = view;
  }

  let content: ReactElement;
  if (view === "history") {
    content = (
      <main className="app-main">
        <HistoryPage />
      </main>
    );
  } else if (view === "compare") {
    content = (
      <main className="app-main">
        <Suspense
          fallback={<p className="compare-status">{t.common.loading}</p>}
        >
          <ComparePage />
        </Suspense>
      </main>
    );
  } else if (view === "planner") {
    content = (
      <main className="app-main">
        <Suspense
          fallback={<p className="planner-status">{t.common.loading}</p>}
        >
          <PlannerPage />
        </Suspense>
      </main>
    );
  } else if (view === "workouts") {
    content = (
      <main className="app-main">
        <WorkoutsPage />
      </main>
    );
  } else if (view === "help") {
    content = (
      <main className="app-main">
        <HelpPage />
      </main>
    );
  } else if (view === "settings") {
    content = (
      <main className="app-main">
        <SettingsPage />
      </main>
    );
  } else {
    content = (
      <div className="app-body">
        <SidebarPanel
          onFile={processFile}
          busy={state.status === "processing"}
        />
        <main className="app-main">
          <DashboardPanel
            state={state}
            onSettingsChange={updateSettings}
            onTitleChange={updateTitle}
            onLoadExample={processUrl}
            onReset={reset}
            onDiscard={discard}
          />
        </main>
        <SidebarInfoCards />
      </div>
    );
  }

  return (
    <>
      <AppHeader activeView={activeView} />
      {content}
      <MobileNav activeView={activeView} />
    </>
  );
}
