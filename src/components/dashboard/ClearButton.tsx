import { Eraser } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./ClearButton.css";

interface ClearButtonProps {
  onReset: () => void;
  onDiscard: () => void;
}

export function ClearButton({
  onReset,
  onDiscard,
}: ClearButtonProps): ReactElement {
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
        aria-label="Clear dashboard"
        title="Clear dashboard"
        aria-expanded={saved ? open : undefined}
        onClick={handleClick}
      >
        <Eraser size={16} aria-hidden="true" />
      </button>
      {open && (
        <div className="clear-button-panel">
          <p>Also delete this ride from History?</p>
          <div className="clear-button-actions">
            <button
              type="button"
              className="clear-button-delete"
              onClick={clearAndDelete}
            >
              Delete
            </button>
            <button
              type="button"
              className="clear-button-keep"
              onClick={clearOnly}
            >
              Keep
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
