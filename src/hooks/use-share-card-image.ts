import { useEffect, useState } from "react";

import { renderShareCard } from "../share/render-share-card";
import { renderSharePhotoCard } from "../share/render-share-photo-card";
import { SHARE_CARD_PALETTE } from "../share/share-card-palette";
import type { ShareCardData } from "../types/share-card-data";
import type { ShareRenderOptions } from "../types/share-render-options";
import type { ShareTileKey } from "../types/share-tile";

/** Renders the share image off-screen for the chosen layout; null while rendering. */
export function useShareCardImage(
  data: ShareCardData,
  selected: ShareTileKey[],
  { mode, variant, photo, shade }: ShareRenderOptions,
): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setUrl(null);
    const tiles = data.tiles.filter((tile) => selected.includes(tile.key));
    const card = { ...data, tiles };
    const render =
      variant === "photo"
        ? renderSharePhotoCard(card, photo, shade)
        : renderShareCard(card, SHARE_CARD_PALETTE[mode]);
    render
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
  }, [data, selected, mode, variant, photo, shade]);

  return url;
}
