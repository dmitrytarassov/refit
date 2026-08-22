import { truncateText } from "./truncate-text";

import type { ShareBox } from "../types/share-box";
import type { ShareCardData, ShareCardPalette } from "../types/share-card-data";

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

/** The ink pill overlapping the map bottom: title + date on the first line, sport · device below. */
export function drawShareHeader(
  ctx: CanvasRenderingContext2D,
  data: ShareCardData,
  { x, y, width }: ShareBox,
  palette: ShareCardPalette,
): void {
  const height = 160;
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = palette.ink;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 36);
  ctx.fill();
  ctx.restore();

  const padX = 44;
  ctx.textBaseline = "middle";
  ctx.fillStyle = palette.inkOn;
  let dateWidth = 0;
  if (data.dateLabel != null) {
    ctx.font = `500 28px ${FONT}`;
    ctx.textAlign = "right";
    ctx.globalAlpha = 0.8;
    ctx.fillText(data.dateLabel, x + width - padX, y + 58);
    ctx.globalAlpha = 1;
    dateWidth = ctx.measureText(data.dateLabel).width + 32;
  }
  ctx.textAlign = "left";
  ctx.font = `700 44px ${FONT}`;
  ctx.fillText(
    truncateText(ctx, data.title, width - 2 * padX - dateWidth),
    x + padX,
    y + 58,
  );
  ctx.font = `400 28px ${FONT}`;
  ctx.globalAlpha = 0.8;
  ctx.fillText(
    truncateText(ctx, data.subtitle, width - 2 * padX),
    x + padX,
    y + 112,
  );
  ctx.globalAlpha = 1;
}
