import { useEffect, useState } from "react";

import { getRoutePalette } from "../db/get-route-palette";
import { saveRoutePalette } from "../db/save-route-palette";
import type { RoutePaletteKey } from "../types/route-palette";
import type { RoutePaletteContextValue } from "../types/route-palette-context-value";

/** Route color palette for the map and share image: loaded from the `routePalette` settings key, saved on change. */
export function useRoutePaletteState(): RoutePaletteContextValue {
  const [paletteKey, setKey] = useState<RoutePaletteKey>("classic");

  useEffect(() => {
    getRoutePalette().then((stored) => {
      if (stored != null) {
        setKey(stored);
      }
    });
  }, []);

  const setPaletteKey = (key: RoutePaletteKey): void => {
    setKey(key);
    void saveRoutePalette(key);
  };

  return { paletteKey, setPaletteKey };
}
