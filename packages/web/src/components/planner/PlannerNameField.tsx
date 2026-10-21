import type { ReactElement } from "react";
import { useState } from "react";

import { useT } from "../../hooks/use-translation";

interface PlannerNameFieldProps {
  value: string;
  onCommit: (name: string) => void;
  onCancel: () => void;
}

/** Inline name editor: Enter / blur commit the trimmed draft, Escape discards it. */
export function PlannerNameField({
  value,
  onCommit,
  onCancel,
}: PlannerNameFieldProps): ReactElement {
  const { t } = useT();
  const [draft, setDraft] = useState(value);
  return (
    <input
      className="planner-name-input"
      type="text"
      value={draft}
      maxLength={80}
      autoFocus
      placeholder={t.planner.untitled}
      aria-label={t.planner.nameLabel}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => onCommit(draft.trim())}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
        } else if (event.key === "Escape") {
          onCancel();
        }
      }}
    />
  );
}
