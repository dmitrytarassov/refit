import "./MobileNavDrawer.css";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { ThemeToggle } from "./ThemeToggle";

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
  if (!open) {
    return null;
  }

  return (
    <div className="mobile-nav-drawer">
      <button
        type="button"
        className="mobile-nav-drawer-backdrop"
        onClick={onClose}
        aria-label="Close menu"
      />
      <nav className="mobile-nav-drawer-panel" aria-label="Main">
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
          Dashboard
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
          History
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
          Settings
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
          Help
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
