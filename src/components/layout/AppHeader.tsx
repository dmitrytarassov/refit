import "./AppHeader.css";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { ThemeToggle } from "./ThemeToggle";

interface AppHeaderProps {
  activeView: "dashboard" | "history" | "help" | "settings";
}

export function AppHeader({ activeView }: AppHeaderProps): ReactElement {
  return (
    <header className="app-header">
      <div className="app-header-brand">
        <svg
          className="app-header-logo"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <polyline
            points="2 12 7 12 10 5 14 19 17 12 22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="app-header-wordmark">ReFit</span>
      </div>
      <nav className="app-header-nav" aria-label="Main">
        <Link
          to="/"
          className={
            activeView === "dashboard"
              ? "app-header-link is-active"
              : "app-header-link"
          }
          aria-current={activeView === "dashboard" ? "page" : undefined}
        >
          Dashboard
        </Link>
        <Link
          to="/?view=history"
          className={
            activeView === "history"
              ? "app-header-link is-active"
              : "app-header-link"
          }
          aria-current={activeView === "history" ? "page" : undefined}
        >
          History
        </Link>
        <Link
          to="/?view=settings"
          className={
            activeView === "settings"
              ? "app-header-link is-active"
              : "app-header-link"
          }
          aria-current={activeView === "settings" ? "page" : undefined}
        >
          Settings
        </Link>
        <Link
          to="/?view=help"
          className={
            activeView === "help"
              ? "app-header-link is-active"
              : "app-header-link"
          }
          aria-current={activeView === "help" ? "page" : undefined}
        >
          Help
        </Link>
      </nav>
      <div className="app-header-actions">
        <ThemeToggle />
        <span className="app-header-avatar" aria-hidden="true">
          DT
        </span>
      </div>
    </header>
  );
}
