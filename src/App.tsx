import "./App.css";
import type { ReactElement } from "react";
import { useSearchParams } from "react-router-dom";

import { DashboardPanel } from "./components/dashboard/DashboardPanel";
import { HelpPage } from "./components/help/HelpPage";
import { HistoryPage } from "./components/history/HistoryPage";
import { AppHeader } from "./components/layout/AppHeader";
import { SettingsPage } from "./components/settings/SettingsPage";
import { SidebarPanel } from "./components/sidebar/SidebarPanel";
import { useFitProcessing } from "./hooks/use-fit-processing";
import { useThemeState } from "./hooks/use-theme-state";
import { ThemeContext } from "./theme/theme-context";

function App(): ReactElement {
  const theme = useThemeState();
  const { state, processFile, processUrl, updateSettings, reset, discard } =
    useFitProcessing();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");

  let content: ReactElement;
  if (view === "history") {
    content = (
      <main className="app-main">
        <HistoryPage />
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
            onLoadExample={processUrl}
            onReset={reset}
            onDiscard={discard}
          />
        </main>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={theme}>
      <div className="app-shell">
        <AppHeader
          activeView={
            view === "history" || view === "help" || view === "settings"
              ? view
              : "dashboard"
          }
        />
        {content}
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
