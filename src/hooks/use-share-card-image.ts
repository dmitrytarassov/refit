import { useEffect, useState } from "react";

import { renderShareCard } from "../share/render-share-card";
import { SHARE_CARD_PALETTE } from "../share/share-card-palette";
import type { ShareCardData } from "../types/share-card-data";
import type { ShareTileKey } from "../types/share-tile";
import type { ThemeMode } from "../types/theme-mode";

/** Renders the share image off-screen; null while tiles are loading. */
export function useShareCardImage(
  data: ShareCardData,
  selected: ShareTileKey[],
  mode: ThemeMode,
): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setUrl(null);
    const tiles = data.tiles.filter((tile) => selected.includes(tile.key));
    renderShareCard({ ...data, tiles }, SHARE_CARD_PALETTE[mode])
      .then((canvas) => {
        if (!cancelled) {
          setUrl(canvas.toDataURL("image/png"));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUrl(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [data, selected, mode]);

  return url;
}
