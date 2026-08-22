import { SHARE_STAT_HEIGHT } from "./share-stat-height";

import type { ShareBox } from "../types/share-box";
import type { ShareTile } from "../types/share-tile";

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

/** Centered column of stats over a photo: small label, big value with the unit. */
export function drawShareStats(
  ctx: CanvasRenderingContext2D,
  tiles: ShareTile[],
  { x, y, width }: ShareBox,
): void {
  const centerX = x + width / 2;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 2;
  tiles.forEach((tile, index) => {
    const top = y + index * SHARE_STAT_HEIGHT;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = `500 26px ${FONT}`;
    ctx.fillText(tile.label, centerX, top + 22);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 64px ${FONT}`;
    if (tile.unit == null) {
      ctx.fillText(tile.value, centerX, top + 78);
      return;
    }
    const valueWidth = ctx.measureText(tile.value).width;
    ctx.font = `500 34px ${FONT}`;
    const unitWidth = ctx.measureText(tile.unit).width;
    const gap = 12;
    const start = centerX - (valueWidth + gap + unitWidth) / 2;
    ctx.textAlign = "left";
    ctx.font = `700 64px ${FONT}`;
    ctx.fillText(tile.value, start, top + 78);
    ctx.font = `500 34px ${FONT}`;
    ctx.fillText(tile.unit, start + valueWidth + gap, top + 86);
    ctx.textAlign = "center";
  });
  ctx.restore();
}
