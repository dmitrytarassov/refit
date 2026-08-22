import "./App.css";
import type { ReactElement } from "react";

import { AppContent } from "./AppContent";
import { LanguagePickerModal } from "./components/layout/LanguagePickerModal";
import { useLanguageState } from "./hooks/use-language-state";
import { useRoutePaletteState } from "./hooks/use-route-palette-state";
import { useThemeState } from "./hooks/use-theme-state";
import { DICTIONARIES } from "./i18n/dictionaries";
import { LanguageContext } from "./i18n/language-context";
import { RoutePaletteContext } from "./route/route-palette-context";
import { ThemeContext } from "./theme/theme-context";

function App(): ReactElement | null {
  const theme = useThemeState();
  const routePalette = useRoutePaletteState();
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
        <RoutePaletteContext.Provider value={routePalette}>
          <div className="app-shell">
            <AppContent />
            {lang == null && <LanguagePickerModal onPick={setLanguage} />}
          </div>
        </RoutePaletteContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
}

export default App;
