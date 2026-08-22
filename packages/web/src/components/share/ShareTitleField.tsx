import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

import { useT } from "../../hooks/use-translation";

interface ShareTitleFieldProps {
  value: string;
  onChange: (title: string) => void;
}

/** Custom ride name for the share image; committed after a typing pause (400 ms) and immediately on Enter / blur. */
export function ShareTitleField({
  value,
  onChange,
}: ShareTitleFieldProps): ReactElement {
  const { t } = useT();
  const [draft, setDraft] = useState(value);
  const sent = useRef(value);

  useEffect(() => {
    if (draft === sent.current) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      sent.current = draft;
      onChange(draft);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [draft, onChange]);

  const commit = (): void => {
    if (draft !== sent.current) {
      sent.current = draft;
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
