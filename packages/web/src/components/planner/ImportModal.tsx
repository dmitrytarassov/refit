import type { ReactElement } from "react";

import { PlannerModal } from "./ui/PlannerModal";
import "./ImportModal.css";

import { useT } from "../../hooks/use-translation";
import { useWorkoutImport } from "../../hooks/use-workout-import";
import type { WorkoutBlock } from "../../types/repeat-block";

interface ImportModalProps {
  ftp: number;
  hasBlocks: boolean;
  onReplace: (blocks: WorkoutBlock[]) => void;
  onAppend: (blocks: WorkoutBlock[]) => void;
  onClose: () => void;
}

export function ImportModal({
  ftp,
  hasBlocks,
  onReplace,
  onAppend,
  onClose,
}: ImportModalProps): ReactElement {
  const { t } = useT();
  const { text, failed, pending, setText, apply, replace, append } =
    useWorkoutImport({ ftp, hasBlocks, onReplace, onAppend, onClose });

  return (
    <PlannerModal title={t.planner.importTitle} wide onClose={onClose}>
      <textarea
        className="import-modal-text"
        value={text}
        placeholder={t.planner.importPlaceholder}
        aria-label={t.planner.importTitle}
        onChange={(event) => setText(event.target.value)}
      />
      {failed && <p className="import-modal-error">{t.planner.importError}</p>}
      <footer className="planner-modal-footer">
        {pending ? (
          <>
            <p className="import-modal-question">{t.planner.importQuestion}</p>
            <button
              type="button"
              className="planner-modal-secondary"
              onClick={append}
            >
              {t.planner.importAppend}
            </button>
            <button
              type="button"
              className="planner-modal-primary"
              onClick={replace}
            >
              {t.planner.importReplace}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="planner-modal-primary"
            onClick={apply}
            disabled={text.trim() === ""}
          >
            {t.planner.importApply}
          </button>
        )}
      </footer>
    </PlannerModal>
  );
}
