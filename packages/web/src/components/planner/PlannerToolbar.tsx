import { deferCall } from "just-defer-call";
import {
  Check,
  ClipboardPaste,
  Download,
  Repeat2,
  Save,
  TrendingDown,
  TrendingUp,
  Waves,
} from "lucide-react";
import type { ReactElement } from "react";

import { PlannerToolButton } from "./PlannerToolButton";
import { PlannerZoneButton } from "./PlannerZoneButton";
import "./PlannerToolbar.css";

import { useT } from "../../hooks/use-translation";
import { makeToolStep, makeZoneStep } from "../../planner/make-step";
import { ZONE_TARGETS } from "../../planner/planner-zones";
import type { SaveStatus } from "../../types/save-status";
import type { WorkoutStep } from "../../types/workout-step";

interface PlannerToolbarProps {
  onAdd: (step: WorkoutStep) => void;
  onAddRepeat: () => void;
  onImport: () => void;
  onSave: () => void;
  saveStatus: SaveStatus;
  onDownload: () => void;
  canDownload: boolean;
}

export function PlannerToolbar({
  onAdd,
  onAddRepeat,
  onImport,
  onSave,
  saveStatus,
  onDownload,
  canDownload,
}: PlannerToolbarProps): ReactElement {
  const { t } = useT();
  return (
    <footer className="planner-toolbar">
      <div className="planner-tools">
        {ZONE_TARGETS.map((_, i) => (
          <PlannerZoneButton
            key={i}
            zone={i + 1}
            onClick={deferCall(onAdd, makeZoneStep(i + 1))}
          />
        ))}
        <span className="planner-tools-divider" />
        <PlannerToolButton
          label={t.planner.tools.rampUp}
          onClick={deferCall(onAdd, makeToolStep("rampUp"))}
        >
          <TrendingUp size={28} aria-hidden="true" />
        </PlannerToolButton>
        <PlannerToolButton
          label={t.planner.tools.rampDown}
          onClick={deferCall(onAdd, makeToolStep("rampDown"))}
        >
          <TrendingDown size={28} aria-hidden="true" />
        </PlannerToolButton>
        <PlannerToolButton
          label={t.planner.tools.freeRide}
          onClick={deferCall(onAdd, makeToolStep("free"))}
        >
          <Waves size={28} aria-hidden="true" />
        </PlannerToolButton>
        <PlannerToolButton label={t.planner.repeat} onClick={onAddRepeat}>
          <Repeat2 size={28} aria-hidden="true" />
        </PlannerToolButton>
      </div>
      <button type="button" className="planner-import" onClick={onImport}>
        <ClipboardPaste size={22} aria-hidden="true" />
        {t.planner.importButton}
      </button>
      <button
        type="button"
        className={
          saveStatus === "saved"
            ? "planner-import planner-save is-saved"
            : "planner-import planner-save"
        }
        onClick={onSave}
        disabled={saveStatus === "saving"}
        aria-live="polite"
      >
        {saveStatus === "saved" ? (
          <Check size={22} aria-hidden="true" />
        ) : (
          <Save size={22} aria-hidden="true" />
        )}
        {saveStatus === "saved" ? t.planner.saved : t.planner.save}
      </button>
      <button
        type="button"
        className="planner-download"
        onClick={onDownload}
        disabled={!canDownload}
      >
        <Download size={22} aria-hidden="true" />
        {t.planner.download}
      </button>
    </footer>
  );
}
