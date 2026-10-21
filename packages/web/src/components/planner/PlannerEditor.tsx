import { deferCall } from "just-defer-call";
import type { ReactElement } from "react";
import { useState } from "react";

import { ImportModal } from "./ImportModal";
import { PlannerHeader } from "./PlannerHeader";
import { PlannerStepEditor } from "./PlannerStepEditor";
import { PlannerToolbar } from "./PlannerToolbar";
import { RepeatModal } from "./RepeatModal";
import { SaveNameModal } from "./SaveNameModal";
import { WorkoutChart } from "./WorkoutChart";
import "./PlannerEditor.css";

import type { WorkoutRow } from "../../db/workout-row";
import { usePlannerKeys } from "../../hooks/use-planner-keys";
import { useT } from "../../hooks/use-translation";
import { useWorkoutPlanner } from "../../hooks/use-workout-planner";
import { useZwoDownload } from "../../hooks/use-zwo-download";
import { isDefaultName } from "../../planner/is-default-name";
import { stepAt } from "../../planner/step-at";
import type { SaveStatus } from "../../types/save-status";

interface PlannerEditorProps {
  loaded: WorkoutRow | null;
  saveStatus: SaveStatus;
  onPersist: (
    data: Pick<WorkoutRow, "name" | "blocks" | "ftp" | "durationSec" | "tss">,
  ) => Promise<void>;
}

/** The planner itself: header, chart, step editor, toolbar and modals around `useWorkoutPlanner`. */
export function PlannerEditor({
  loaded,
  saveStatus,
  onPersist,
}: PlannerEditorProps): ReactElement {
  const {
    workout,
    ftp,
    weightKg,
    totalSeconds,
    tss,
    selected,
    select,
    toggleRepeat,
    rename,
    addStep,
    addRepeat,
    updateStep,
    updateRepeat,
    removeSelected,
    replaceBlocks,
    appendBlocks,
    undo,
    redo,
    setFtp,
    setWeightKg,
  } = useWorkoutPlanner(loaded);
  usePlannerKeys({ delete: removeSelected, undo, redo });
  const [editingRepeat, setEditingRepeat] = useState<number | null>(null);
  const [isImportOpen, setImportOpen] = useState(false);
  const [isNameOpen, setNameOpen] = useState(false);
  const { t } = useT();
  const { download } = useZwoDownload();
  const selectedStep =
    selected == null ? undefined : stepAt(workout.blocks, selected);
  const repeatBlock =
    editingRepeat == null ? undefined : workout.blocks[editingRepeat];

  const persistAs = (name: string): void => {
    void onPersist({
      name,
      blocks: workout.blocks,
      ftp,
      durationSec: totalSeconds,
      tss: Math.round(tss),
    });
  };

  const save = (): void => {
    if (isDefaultName(workout.name, t.planner.untitled)) {
      setNameOpen(true);
    } else {
      persistAs(workout.name);
    }
  };

  const saveNamed = (name: string): void => {
    setNameOpen(false);
    rename(name);
    persistAs(name);
  };

  return (
    <section className="planner-page">
      <article className="planner-card">
        <PlannerHeader
          name={workout.name}
          ftp={ftp}
          weightKg={weightKg}
          totalSeconds={totalSeconds}
          tss={tss}
          onRename={rename}
          onFtpChange={setFtp}
          onWeightChange={setWeightKg}
        />
        <WorkoutChart
          workout={workout}
          selected={selected}
          onSelect={select}
          onToggleRepeat={toggleRepeat}
          onEditRepeat={setEditingRepeat}
        />
        {selected != null && selectedStep != null && (
          <PlannerStepEditor
            stepRef={selected}
            step={selectedStep}
            ftp={ftp}
            onChange={updateStep}
            onClose={deferCall(select, null)}
          />
        )}
      </article>
      <PlannerToolbar
        onAdd={addStep}
        onAddRepeat={addRepeat}
        onImport={deferCall(setImportOpen, true)}
        onSave={save}
        saveStatus={saveStatus}
        onDownload={() =>
          download(
            isDefaultName(workout.name, t.planner.untitled)
              ? t.planner.untitled
              : workout.name,
            workout.blocks,
          )
        }
        canDownload={workout.blocks.length > 0}
      />
      {isNameOpen && (
        <SaveNameModal
          onSubmit={saveNamed}
          onClose={deferCall(setNameOpen, false)}
        />
      )}
      {editingRepeat != null && repeatBlock?.kind === "repeat" && (
        <RepeatModal
          index={editingRepeat}
          block={repeatBlock}
          onChange={updateRepeat}
          onClose={deferCall(setEditingRepeat, null)}
        />
      )}
      {isImportOpen && (
        <ImportModal
          ftp={ftp}
          hasBlocks={workout.blocks.length > 0}
          onReplace={replaceBlocks}
          onAppend={appendBlocks}
          onClose={deferCall(setImportOpen, false)}
        />
      )}
    </section>
  );
}
