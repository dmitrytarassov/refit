import { createContext } from "react";

import type { ThemeContextValue } from "../types/theme-mode";

export const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  toggle: () => {},
});
