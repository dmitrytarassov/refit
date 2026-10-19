import type { ReactElement } from "react";
import { Suspense, lazy } from "react";
import { useSearchParams } from "react-router-dom";

import { DashboardPanel } from "./components/dashboard/DashboardPanel";
import { HelpPage } from "./components/help/HelpPage";
import { HistoryPage } from "./components/history/HistoryPage";
import { AppHeader } from "./components/layout/AppHeader";
import { MobileNav } from "./components/layout/MobileNav";
import { SettingsPage } from "./components/settings/SettingsPage";
import { SidebarInfoCards } from "./components/sidebar/SidebarInfoCards";
import { SidebarPanel } from "./components/sidebar/SidebarPanel";
import { useFitProcessing } from "./hooks/use-fit-processing";
import { useT } from "./hooks/use-translation";

// Carries recharts through the power curve card — kept out of the main chunk
// like the dashboard.
const ComparePage = lazy(() =>
  import("./components/compare/ComparePage").then((m) => ({
    default: m.ComparePage,
  })),
);

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
  let activeView: "dashboard" | "history" | "help" | "settings" = "dashboard";
  if (view === "history" || view === "compare") {
    activeView = "history";
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
