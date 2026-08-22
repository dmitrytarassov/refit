import { EN } from "./en";
import { RU } from "./ru";
import type { Translation } from "./translation";

import type { Language } from "../types/language";

export const DICTIONARIES: Record<Language, Translation> = { en: EN, ru: RU };
