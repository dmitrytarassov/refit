import "./MobileNavBar.css";
import { History, Home, Menu, Settings } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

interface MobileNavBarProps {
  activeView: "dashboard" | "history" | "help" | "settings";
  onOpenMenu: () => void;
}

export function MobileNavBar({
  activeView,
  onOpenMenu,
}: MobileNavBarProps): ReactElement {
  return (
    <nav className="mobile-nav-bar" aria-label="Mobile">
      <Link
        to="/"
        className={
          activeView === "dashboard"
            ? "mobile-nav-item is-active"
            : "mobile-nav-item"
        }
        aria-current={activeView === "dashboard" ? "page" : undefined}
        aria-label="Dashboard"
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
        aria-label="History"
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
        aria-label="Settings"
      >
        <Settings size={22} aria-hidden="true" />
      </Link>
      <button
        type="button"
        className="mobile-nav-item"
        onClick={onOpenMenu}
        aria-label="Menu"
      >
        <Menu size={22} aria-hidden="true" />
      </button>
    </nav>
  );
}
