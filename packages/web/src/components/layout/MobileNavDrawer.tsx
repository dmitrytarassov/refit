import "./MobileNavDrawer.css";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { ThemeToggle } from "./ThemeToggle";

import { useT } from "../../hooks/use-translation";

interface MobileNavDrawerProps {
  open: boolean;
  activeView: "dashboard" | "history" | "help" | "settings";
  onClose: () => void;
}

export function MobileNavDrawer({
  open,
  activeView,
  onClose,
}: MobileNavDrawerProps): ReactElement | null {
  const { t } = useT();
  if (!open) {
    return null;
  }

  return (
    <div className="mobile-nav-drawer">
      <button
        type="button"
        className="mobile-nav-drawer-backdrop"
        onClick={onClose}
        aria-label={t.nav.closeMenu}
      />
      <nav className="mobile-nav-drawer-panel" aria-label={t.nav.main}>
        <Link
          to="/"
          onClick={onClose}
          className={
            activeView === "dashboard"
              ? "mobile-nav-drawer-link is-active"
              : "mobile-nav-drawer-link"
          }
          aria-current={activeView === "dashboard" ? "page" : undefined}
        >
          {t.nav.dashboard}
        </Link>
        <Link
          to="/?view=history"
          onClick={onClose}
          className={
            activeView === "history"
              ? "mobile-nav-drawer-link is-active"
              : "mobile-nav-drawer-link"
          }
          aria-current={activeView === "history" ? "page" : undefined}
        >
          {t.nav.history}
        </Link>
        <Link
          to="/?view=settings"
          onClick={onClose}
          className={
            activeView === "settings"
              ? "mobile-nav-drawer-link is-active"
              : "mobile-nav-drawer-link"
          }
          aria-current={activeView === "settings" ? "page" : undefined}
        >
          {t.nav.settings}
        </Link>
        <Link
          to="/?view=help"
          onClick={onClose}
          className={
            activeView === "help"
              ? "mobile-nav-drawer-link is-active"
              : "mobile-nav-drawer-link"
          }
          aria-current={activeView === "help" ? "page" : undefined}
        >
          {t.nav.help}
        </Link>
        <a
          className="mobile-nav-drawer-link"
          href="https://github.com/dmitrytarassov/refit"
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
        >
          GitHub
        </a>
        <a
          className="mobile-nav-drawer-link"
          href="https://t.me/refit_app"
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
        >
          Telegram
        </a>
        <div className="mobile-nav-drawer-footer">
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
