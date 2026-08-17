import "./App.css";
import type { ReactElement } from "react";

import { AppContent } from "./AppContent";
import { LanguagePickerModal } from "./components/layout/LanguagePickerModal";
import { useLanguageState } from "./hooks/use-language-state";
import { useThemeState } from "./hooks/use-theme-state";
import { DICTIONARIES } from "./i18n/dictionaries";
import { LanguageContext } from "./i18n/language-context";
import { ThemeContext } from "./theme/theme-context";

function App(): ReactElement | null {
  const theme = useThemeState();
  const { lang, loaded, setLanguage } = useLanguageState();

  if (!loaded) {
    return null;
  }

  const effectiveLang = lang ?? "en";

  return (
    <LanguageContext.Provider
      value={{
        lang: effectiveLang,
        t: DICTIONARIES[effectiveLang],
        setLanguage,
      }}
    >
      <ThemeContext.Provider value={theme}>
        <div className="app-shell">
          <AppContent />
          {lang == null && <LanguagePickerModal onPick={setLanguage} />}
        </div>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
}

export default App;
