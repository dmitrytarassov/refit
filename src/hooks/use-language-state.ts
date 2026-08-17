import { useEffect, useState } from "react";

import { getLanguage } from "../db/get-language";
import { saveLanguage } from "../db/save-language";
import type { Language } from "../types/language";

export function useLanguageState(): {
  lang: Language | null;
  loaded: boolean;
  setLanguage: (lang: Language) => void;
} {
  const [lang, setLang] = useState<Language | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getLanguage()
      .then((stored) => {
        setLang(stored);
        document.documentElement.lang = stored ?? "en";
      })
      .finally(() => setLoaded(true));
  }, []);

  const setLanguage = (next: Language): void => {
    setLang(next);
    document.documentElement.lang = next;
    void saveLanguage(next);
  };

  return { lang, loaded, setLanguage };
}
