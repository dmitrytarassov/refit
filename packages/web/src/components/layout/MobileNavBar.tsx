import "./MobileNavBar.css";
import { History, Home, Menu, Settings } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { useT } from "../../hooks/use-translation";

interface MobileNavBarProps {
  activeView: "dashboard" | "history" | "help" | "settings";
  onOpenMenu: () => void;
}

export function MobileNavBar({
  activeView,
  onOpenMenu,
}: MobileNavBarProps): ReactElement {
  const { t } = useT();
  return (
    <nav className="mobile-nav-bar" aria-label={t.nav.mobile}>
      <Link
        to="/"
        className={
          activeView === "dashboard"
            ? "mobile-nav-item is-active"
            : "mobile-nav-item"
        }
        aria-current={activeView === "dashboard" ? "page" : undefined}
        aria-label={t.nav.dashboard}
      >
        <Home size={22} aria-hidden="true" />
      </Link>
      <Link
        to="/?view=history"
        className={
          activeView === "history"
            ? "mobile-nav-item is-active"
            : "mobile-nav-item"
        }
        aria-current={activeView === "history" ? "page" : undefined}
        aria-label={t.nav.history}
      >
        <History size={22} aria-hidden="true" />
      </Link>
      <Link
        to="/?view=settings"
        className={
          activeView === "settings"
            ? "mobile-nav-item is-active"
            : "mobile-nav-item"
        }
        aria-current={activeView === "settings" ? "page" : undefined}
        aria-label={t.nav.settings}
      >
        <Settings size={22} aria-hidden="true" />
      </Link>
      <button
        type="button"
        className="mobile-nav-item"
        onClick={onOpenMenu}
        aria-label={t.nav.menu}
      >
        <Menu size={22} aria-hidden="true" />
      </button>
    </nav>
  );
}
