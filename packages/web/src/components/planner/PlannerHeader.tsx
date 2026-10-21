import { deferCall } from "just-defer-call";
import { ArrowLeft, Pencil } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { PlannerNameField } from "./PlannerNameField";
import { PlannerReadonlyField } from "./PlannerReadonlyField";
import { PlannerStepperField } from "./PlannerStepperField";
import "./PlannerHeader.css";

import { formatDuration } from "../../fit/format-metrics";
import { useT } from "../../hooks/use-translation";

interface PlannerHeaderProps {
  name: string;
  ftp: number;
  weightKg: number;
  totalSeconds: number;
  tss: number;
  onRename: (name: string) => void;
  onFtpChange: (value: number) => void;
  onWeightChange: (value: number) => void;
}

export function PlannerHeader({
  name,
  ftp,
  weightKg,
  totalSeconds,
  tss,
  onRename,
  onFtpChange,
  onWeightChange,
}: PlannerHeaderProps): ReactElement {
  const { t } = useT();
  const [editing, setEditing] = useState(false);

  const commit = (next: string): void => {
    setEditing(false);
    onRename(next);
  };

  return (
    <header className="planner-header">
      <div className="planner-title">
        <Link
          to="/?view=workouts"
          className="planner-back"
          aria-label={t.planner.back}
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
        {editing ? (
          <PlannerNameField
            value={name}
            onCommit={commit}
            onCancel={deferCall(setEditing, false)}
          />
        ) : (
          <>
            <h2 className="planner-name" title={name}>
              {name === "" ? t.planner.untitled : name}
            </h2>
            <button
              type="button"
              className="planner-rename"
              aria-label={t.planner.rename}
              onClick={deferCall(setEditing, true)}
            >
              <Pencil size={16} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      <div className="planner-fields">
        <PlannerStepperField
          label={t.planner.ftp}
          value={ftp}
          step={5}
          min={50}
          max={600}
          onChange={onFtpChange}
        />
        <PlannerStepperField
          label={t.planner.weight}
          value={weightKg}
          step={1}
          min={30}
          max={200}
          onChange={onWeightChange}
        />
        <PlannerReadonlyField
          label={t.planner.workoutTime}
          value={formatDuration(totalSeconds)}
        />
        <PlannerReadonlyField
          label={t.planner.trainingLoad}
          value={String(Math.round(tss))}
        />
      </div>
    </header>
  );
}
