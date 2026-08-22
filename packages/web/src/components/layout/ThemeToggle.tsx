import "./ThemeToggle.css";
import type { ReactElement } from "react";

import { useTheme } from "../../hooks/use-theme";
import { useT } from "../../hooks/use-translation";

export function ThemeToggle(): ReactElement {
  const { mode, toggle } = useTheme();
  const dark = mode === "dark";
  const { t } = useT();

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={dark ? t.nav.switchToLight : t.nav.switchToDark}
      onClick={toggle}
    >
      {dark ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
