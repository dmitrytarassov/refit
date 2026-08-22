import { useContext } from "react";

import { LanguageContext } from "../i18n/language-context";
import type { Translation } from "../i18n/translation";
import type { Language } from "../types/language";

export function useT(): {
  t: Translation;
  lang: Language;
  setLanguage: (lang: Language) => void;
} {
  return useContext(LanguageContext);
}
