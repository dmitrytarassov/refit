import { X } from "lucide-react";
import type { ReactElement } from "react";
import { useEffect } from "react";

import { CompareSlotList } from "./CompareSlotList";
import "./CompareModal.css";

import { useComparePicker } from "../../hooks/use-compare-picker";
import { useRideHistory } from "../../hooks/use-ride-history";
import { useT } from "../../hooks/use-translation";

interface CompareModalProps {
  ids: number[];
  onClose: () => void;
}

/** Both compare slots side by side; a pick rewrites the URL and keeps the modal open. */
export function CompareModal({
  ids,
  onClose,
}: CompareModalProps): ReactElement {
  const { t } = useT();
  const { rides, loading } = useRideHistory();
  const { pick } = useComparePicker(ids);

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
    <div className="compare-modal" role="dialog" aria-modal="true">
      <button
        type="button"
        className="compare-modal-backdrop"
        onClick={onClose}
        aria-label={t.nav.close}
      />
      <section
        className="compare-modal-panel"
        aria-label={t.compare.modalTitle}
      >
        <header className="compare-modal-header">
          <h2>{t.compare.modalTitle}</h2>
          <button
            type="button"
            className="compare-modal-close"
            onClick={onClose}
            aria-label={t.nav.close}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        <div className="compare-modal-body">
          {loading ? (
            <p className="compare-status">{t.common.loading}</p>
          ) : (
            [0, 1].map((slot) => (
              <CompareSlotList
                key={slot}
                slot={slot}
                ids={ids}
                rides={rides}
                onPick={pick}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
