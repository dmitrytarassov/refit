import "./LanguagePickerModal.css";
import { deferCall } from "just-defer-call";
import type { ReactElement } from "react";

import { useT } from "../../hooks/use-translation";
import type { Language } from "../../types/language";

export function LanguagePickerModal({
  onPick,
}: {
  onPick: (lang: Language) => void;
}): ReactElement {
  const { t } = useT();

  return (
    <div className="language-picker" role="dialog" aria-modal="true">
      <div className="language-picker-panel">
        <h2>{t.language.modalTitle}</h2>
        <div className="language-picker-buttons">
          <button type="button" onClick={deferCall(onPick, "en")}>
            {t.language.english}
          </button>
          <button type="button" onClick={deferCall(onPick, "ru")}>
            {t.language.russian}
          </button>
        </div>
      </div>
    </div>
  );
}
