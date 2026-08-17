import "./AppHeader.css";
import { Send } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { ThemeToggle } from "./ThemeToggle";
import { AppLogo } from "./ui/AppLogo";

import { useT } from "../../hooks/use-translation";

interface AppHeaderProps {
  activeView: "dashboard" | "history" | "help" | "settings";
}

export function AppHeader({ activeView }: AppHeaderProps): ReactElement {
  const { t } = useT();
  return (
    <header className="app-header">
      <div className="app-header-brand">
        <AppLogo />
      </div>
      <nav className="app-header-nav" aria-label={t.nav.main}>
        <Link
          to="/"
          className={
            activeView === "dashboard"
              ? "app-header-link is-active"
              : "app-header-link"
          }
          aria-current={activeView === "dashboard" ? "page" : undefined}
        >
          {t.nav.dashboard}
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
          {t.nav.history}
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
          {t.nav.settings}
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
          {t.nav.help}
        </Link>
      </nav>
      <div className="app-header-actions">
        <ThemeToggle />
        <a
          className="app-header-icon-link"
          href="https://github.com/dmitrytarassov/refit"
          target="_blank"
          rel="noreferrer"
          aria-label={t.nav.github}
        >
          <svg
            viewBox="0 0 16 16"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
          </svg>
        </a>
        <a
          className="app-header-icon-link"
          href="https://t.me/refit_app"
          target="_blank"
          rel="noreferrer"
          aria-label={t.nav.telegram}
        >
          <Send size={18} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
