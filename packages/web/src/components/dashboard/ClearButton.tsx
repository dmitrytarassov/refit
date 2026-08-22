import { Eraser } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./ClearButton.css";
import { useT } from "../../hooks/use-translation";

interface ClearButtonProps {
  onReset: () => void;
  onDiscard: () => void;
}

export function ClearButton({
  onReset,
  onDiscard,
}: ClearButtonProps): ReactElement {
  const { t } = useT();
  const [searchParams] = useSearchParams();
  const saved = searchParams.get("record") != null;
  const [open, setOpen] = useState(false);

  const handleClick = (): void => {
    if (!saved) {
      onReset();
      return;
    }
    setOpen(!open);
  };

  const clearOnly = (): void => {
    setOpen(false);
    onReset();
  };

  const clearAndDelete = (): void => {
    setOpen(false);
    onDiscard();
  };

  return (
    <span className="clear-button">
      <button
        type="button"
        className="file-header-card-clear"
        aria-label={t.dashboard.clear.aria}
        title={t.dashboard.clear.aria}
        aria-expanded={saved ? open : undefined}
        onClick={handleClick}
      >
        <Eraser size={16} aria-hidden="true" />
      </button>
      {open && (
        <div className="clear-button-panel">
          <p>{t.dashboard.clear.confirm}</p>
          <div className="clear-button-actions">
            <button
              type="button"
              className="clear-button-delete"
              onClick={clearAndDelete}
            >
              {t.dashboard.clear.delete}
            </button>
            <button
              type="button"
              className="clear-button-keep"
              onClick={clearOnly}
            >
              {t.dashboard.clear.keep}
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
