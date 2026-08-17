import { X } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { useEffect } from "react";
import "./ChartCardExpanded.css";

interface ChartCardExpandedProps {
  title: string;
  aside?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

export function ChartCardExpanded({
  title,
  aside,
  onClose,
  children,
}: ChartCardExpandedProps): ReactElement {
  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="chart-card-modal" role="dialog" aria-modal="true">
      <button
        type="button"
        className="chart-card-modal-backdrop"
        onClick={onClose}
        aria-label="Close"
      />
      <section className="chart-card-modal-panel" aria-label={title}>
        <header className="chart-card-header">
          <h2>{title}</h2>
          {aside != null && <div className="chart-card-aside">{aside}</div>}
          <button
            type="button"
            className="chart-card-icon-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        <div className="chart-card-modal-body">{children}</div>
      </section>
    </div>
  );
}
