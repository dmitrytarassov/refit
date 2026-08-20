import type { ReactElement } from "react";
import { useState } from "react";

import { useT } from "../../hooks/use-translation";

interface ShareTitleFieldProps {
  value: string;
  onChange: (title: string) => void;
}

/** Custom ride name for the share image; committed on blur / Enter so typing doesn't re-render the canvas. */
export function ShareTitleField({
  value,
  onChange,
}: ShareTitleFieldProps): ReactElement {
  const { t } = useT();
  const [draft, setDraft] = useState(value);
  const commit = (): void => {
    if (draft.trim() !== value) {
      onChange(draft);
    }
  };

  return (
    <label className="share-title-field">
      <span>{t.share.titleLabel}</span>
      <input
        type="text"
        value={draft}
        maxLength={60}
        placeholder={t.share.titlePlaceholder}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
      />
    </label>
  );
}
