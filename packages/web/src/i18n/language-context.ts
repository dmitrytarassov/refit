import { createContext } from "react";

import { EN } from "./en";
import type { Translation } from "./translation";

import type { Language } from "../types/language";

export const LanguageContext = createContext<{
  lang: Language;
  t: Translation;
  setLanguage: (lang: Language) => void;
}>({ lang: "en", t: EN, setLanguage: () => {} });
