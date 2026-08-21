import { Moon, Sun } from "lucide-react";
import type { ReactElement } from "react";

import { useTheme } from "../../hooks/use-theme";
import { useT } from "../../hooks/use-translation";

/** Sun/Moon icon button toggling the app theme from the share modal footer. */
export function ShareThemeButton(): ReactElement {
  const { t } = useT();
  const { mode, toggle } = useTheme();
  const label = mode === "dark" ? t.nav.switchToLight : t.nav.switchToDark;
  return (
    <button
      type="button"
      className="share-modal-icon-button"
      aria-label={label}
      title={label}
      onClick={toggle}
    >
      {mode === "dark" ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}
