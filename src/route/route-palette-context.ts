import { createContext } from "react";

import type { RoutePaletteContextValue } from "../types/route-palette-context-value";

export const RoutePaletteContext = createContext<RoutePaletteContextValue>({
  paletteKey: "classic",
  setPaletteKey: () => {},
});
