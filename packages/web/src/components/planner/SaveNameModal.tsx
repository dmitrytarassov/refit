import type { ReactElement } from "react";
import { useState } from "react";

import { PlannerModal } from "./ui/PlannerModal";
import "./SaveNameModal.css";

import { useT } from "../../hooks/use-translation";

interface SaveNameModalProps {
  onSubmit: (name: string) => void;
  onClose: () => void;
}

/** Asks for a name before the first save of an unnamed workout; Enter or the button submits the trimmed text. */
export function SaveNameModal({
  onSubmit,
  onClose,
}: SaveNameModalProps): ReactElement {
  const { t } = useT();
  const [draft, setDraft] = useState("");
  const name = draft.trim();

  return (
    <PlannerModal title={t.planner.nameModalTitle} onClose={onClose}>
      <p className="planner-modal-text">{t.planner.nameModalText}</p>
      <input
        className="save-name-input"
        type="text"
        value={draft}
        maxLength={80}
        autoFocus
        placeholder={t.planner.nameLabel}
        aria-label={t.planner.nameLabel}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && name !== "") {
            onSubmit(name);
          }
        }}
      />
      <footer className="planner-modal-footer">
        <button
          type="button"
          className="planner-modal-primary"
          disabled={name === ""}
          onClick={() => onSubmit(name)}
        >
          {t.planner.save}
        </button>
      </footer>
    </PlannerModal>
  );
}
