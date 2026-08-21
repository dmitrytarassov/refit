import { useContext } from "react";

import { RoutePaletteContext } from "../route/route-palette-context";
import type { RoutePaletteContextValue } from "../types/route-palette-context-value";

export function useRoutePalette(): RoutePaletteContextValue {
  return useContext(RoutePaletteContext);
}
