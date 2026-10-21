import type { ReactElement } from "react";

import { PlannerStepperField } from "./PlannerStepperField";
import { PlannerModal } from "./ui/PlannerModal";
import "./RepeatModal.css";

import { useT } from "../../hooks/use-translation";
import type { RepeatBlock } from "../../types/repeat-block";
import { ToggleSwitch } from "../common/ui/ToggleSwitch";

interface RepeatModalProps {
  index: number;
  block: RepeatBlock;
  onChange: (
    index: number,
    patch: Partial<Pick<RepeatBlock, "times" | "skipLast">>,
  ) => void;
  onClose: () => void;
}

/** Repetition count and the skip-last switch for one repeat block; changes apply at once. */
export function RepeatModal({
  index,
  block,
  onChange,
  onClose,
}: RepeatModalProps): ReactElement {
  const { t } = useT();
  return (
    <PlannerModal title={t.planner.editRepeat} onClose={onClose}>
      <div className="repeat-modal-body">
        <PlannerStepperField
          label={t.planner.repeatTimes}
          value={block.times}
          step={1}
          min={2}
          max={99}
          onChange={(times) => onChange(index, { times })}
        />
        <ToggleSwitch
          label={t.planner.skipLast}
          checked={block.skipLast}
          onChange={(skipLast) => onChange(index, { skipLast })}
        />
        <p className="planner-modal-text">{t.planner.skipLastHint}</p>
      </div>
    </PlannerModal>
  );
}
