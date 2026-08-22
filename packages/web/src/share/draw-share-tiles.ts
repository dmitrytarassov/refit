import { SHARE_TILE_GAP, SHARE_TILE_HEIGHT } from "./share-tile-size";
import { truncateText } from "./truncate-text";

import type { ShareBox } from "../types/share-box";
import type { ShareCardPalette } from "../types/share-card-data";
import type { ShareTile } from "../types/share-tile";

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

/** Three-column grid of metric tiles. */
export function drawShareTiles(
  ctx: CanvasRenderingContext2D,
  tiles: ShareTile[],
  { x, y, width }: ShareBox,
  palette: ShareCardPalette,
): void {
  const columns = 3;
  const gap = SHARE_TILE_GAP;
  const tileWidth = (width - gap * (columns - 1)) / columns;
  const tileHeight = SHARE_TILE_HEIGHT;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  tiles.forEach((tile, index) => {
    const tx = x + (index % columns) * (tileWidth + gap);
    const ty = y + Math.floor(index / columns) * (tileHeight + gap);
    ctx.fillStyle = palette.card;
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(tx, ty, tileWidth, tileHeight, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = palette.textSecondary;
    ctx.font = `500 26px ${FONT}`;
    ctx.fillText(
      truncateText(ctx, tile.label, tileWidth - 56),
      tx + 28,
      ty + 52,
    );

    ctx.fillStyle = palette.text;
    ctx.font = `700 60px ${FONT}`;
    ctx.fillText(tile.value, tx + 28, ty + 128);
    if (tile.unit != null) {
      const valueWidth = ctx.measureText(tile.value).width;
      ctx.fillStyle = palette.textMuted;
      ctx.font = `400 28px ${FONT}`;
      ctx.fillText(tile.unit, tx + 28 + valueWidth + 10, ty + 138);
    }
  });
}
