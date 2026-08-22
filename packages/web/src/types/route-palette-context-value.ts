import type { RoutePaletteKey } from "./route-palette";

export interface RoutePaletteContextValue {
  paletteKey: RoutePaletteKey;
  setPaletteKey: (key: RoutePaletteKey) => void;
}
