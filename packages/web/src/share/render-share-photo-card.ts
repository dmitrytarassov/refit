import { drawPhotoCover } from "./draw-photo-cover";
import { drawRouteTrace } from "./draw-route-trace";
import { drawShareShade } from "./draw-share-shade";
import { drawShareStats } from "./draw-share-stats";
import { SHARE_CARD_HEIGHT, SHARE_CARD_WIDTH } from "./share-card-size";
import { SHARE_STAT_HEIGHT } from "./share-stat-height";
import { truncateText } from "./truncate-text";

import type { ShareCardData } from "../types/share-card-data";
import type { ShareShade } from "../types/share-shade";

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

/** Renders the 9:16 photo share image: the photo as the background, the title on top, centered stats, the route trace, the wordmark. */
export async function renderSharePhotoCard(
  data: ShareCardData,
  photo: HTMLImageElement | null,
  shade: ShareShade,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = SHARE_CARD_WIDTH;
  canvas.height = SHARE_CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (ctx == null) {
    throw new Error("Canvas 2D context is unavailable");
  }
  if (photo == null) {
    const background = ctx.createLinearGradient(0, 0, 0, SHARE_CARD_HEIGHT);
    background.addColorStop(0, "#2A3572");
    background.addColorStop(1, "#0F1220");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);
  } else {
    drawPhotoCover(ctx, photo, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);
  }

  const margin = 48;
  const shadePad = 80;
  const titleCenter = 140;
  const titleHeight = 64;
  const traceSize = 280;
  const footerTop = SHARE_CARD_HEIGHT - 150;
  const traceTop =
    data.points.length > 0 ? footerTop - 24 - traceSize : footerTop;
  const statsHeight = data.tiles.length * SHARE_STAT_HEIGHT;
  const statsTop = traceTop - 32 - statsHeight;

  drawShareShade(
    ctx,
    shade,
    titleCenter + titleHeight / 2 + shadePad,
    statsTop - shadePad,
  );

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 56px ${FONT}`;
  ctx.fillText(
    truncateText(ctx, data.title, SHARE_CARD_WIDTH - 2 * margin),
    SHARE_CARD_WIDTH / 2,
    titleCenter,
  );
  ctx.restore();

  drawShareStats(ctx, data.tiles, {
    x: margin,
    y: statsTop,
    width: SHARE_CARD_WIDTH - 2 * margin,
  });
  if (data.points.length > 0) {
    drawRouteTrace(
      ctx,
      data.points,
      { x: (SHARE_CARD_WIDTH - traceSize) / 2, y: traceTop, width: traceSize },
      data.routePalette,
    );
  }

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 48px ${FONT}`;
  ctx.fillText("ReFit", SHARE_CARD_WIDTH / 2, footerTop + 40);
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = `400 24px ${FONT}`;
  ctx.fillText(
    "dmitrytarassov.github.io/refit",
    SHARE_CARD_WIDTH / 2,
    footerTop + 96,
  );
  ctx.restore();
  return canvas;
}
