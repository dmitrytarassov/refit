import { X } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { useEffect } from "react";

import "./PlannerModal.css";
import { useT } from "../../../hooks/use-translation";

interface PlannerModalProps {
  title: string;
  wide?: boolean;
  onClose: () => void;
  children: ReactNode;
}

/** Centered dialog shell: backdrop, header with title and X, Escape to close. */
export function PlannerModal({
  title,
  wide,
  onClose,
  children,
}: PlannerModalProps): ReactElement {
  const { t } = useT();

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
    <div className="planner-modal" role="dialog" aria-modal="true">
      <button
        type="button"
        className="planner-modal-backdrop"
        onClick={onClose}
        aria-label={t.nav.close}
      />
      <section
        className={wide ? "planner-modal-panel is-wide" : "planner-modal-panel"}
        aria-label={title}
      >
        <header className="planner-modal-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="planner-modal-close"
            onClick={onClose}
            aria-label={t.nav.close}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
