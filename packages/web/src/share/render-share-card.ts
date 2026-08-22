import { drawMapTiles } from "./draw-map-tiles";
import { drawRouteLine } from "./draw-route-line";
import { drawShareHeader } from "./draw-share-header";
import { drawShareTiles } from "./draw-share-tiles";
import { fitMapView } from "./fit-map-view";
import { SHARE_CARD_HEIGHT, SHARE_CARD_WIDTH } from "./share-card-size";
import { shareTilesHeight } from "./share-tiles-height";

import type { ShareCardData, ShareCardPalette } from "../types/share-card-data";

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

/** Renders the 9:16 share image: map with the route on top, header pill, metric tiles, footer. */
export async function renderShareCard(
  data: ShareCardData,
  palette: ShareCardPalette,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = SHARE_CARD_WIDTH;
  canvas.height = SHARE_CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (ctx == null) {
    throw new Error("Canvas 2D context is unavailable");
  }
  const margin = 48;
  const width = SHARE_CARD_WIDTH - 2 * margin;
  const headerHeight = 160;
  const footerTop = SHARE_CARD_HEIGHT - 120;
  const tilesHeight = shareTilesHeight(data.tiles.length);
  const tilesTop = footerTop - 40 - tilesHeight;
  const headerTop = tilesTop - 48 - headerHeight;
  // The map takes everything above the header pill; the pill overlaps its bottom edge.
  const mapHeight = headerTop + headerHeight / 2;
  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);

  if (data.points.length > 0) {
    const view = fitMapView(data.points, SHARE_CARD_WIDTH, mapHeight, 120);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, SHARE_CARD_WIDTH, mapHeight);
    ctx.clip();
    await drawMapTiles(ctx, view, SHARE_CARD_WIDTH, mapHeight);
    drawRouteLine(ctx, data.points, view, data.routePalette);
    const fade = ctx.createLinearGradient(0, mapHeight - 220, 0, mapHeight);
    fade.addColorStop(0, "rgba(0, 0, 0, 0)");
    fade.addColorStop(1, palette.background);
    ctx.fillStyle = fade;
    ctx.fillRect(0, mapHeight - 220, SHARE_CARD_WIDTH, 220);
    ctx.restore();

    ctx.font = `400 20px ${FONT}`;
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    const credit = "© OpenStreetMap contributors";
    const creditWidth = ctx.measureText(credit).width + 20;
    ctx.fillRect(SHARE_CARD_WIDTH - creditWidth - 16, 16, creditWidth, 32);
    ctx.fillStyle = "#161B33";
    ctx.fillText(credit, SHARE_CARD_WIDTH - 26, 22);
  }

  drawShareHeader(ctx, data, { x: margin, y: headerTop, width }, palette);
  drawShareTiles(ctx, data.tiles, { x: margin, y: tilesTop, width }, palette);

  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = palette.text;
  ctx.font = `700 40px ${FONT}`;
  ctx.fillText("ReFit", margin, SHARE_CARD_HEIGHT - 70);
  ctx.textAlign = "right";
  ctx.fillStyle = palette.textMuted;
  ctx.font = `400 26px ${FONT}`;
  ctx.fillText(
    "dmitrytarassov.github.io/refit",
    SHARE_CARD_WIDTH - margin,
    SHARE_CARD_HEIGHT - 70,
  );
  return canvas;
}
