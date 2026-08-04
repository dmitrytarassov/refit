import { useState } from "react";

import type { ThemeContextValue, ThemeMode } from "../types/theme-mode";

export function useThemeState(): ThemeContextValue {
  const [mode, setMode] = useState<ThemeMode>(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const toggle = (): void => {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setMode(next);
  };
  return { mode, toggle };
}
