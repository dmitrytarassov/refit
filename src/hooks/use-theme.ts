import { useContext } from "react";

import { ThemeContext } from "../theme/theme-context";
import type { ThemeContextValue } from "../types/theme-mode";

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
