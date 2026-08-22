import { drawRouteLine } from "./draw-route-line";
import { fitMapView } from "./fit-map-view";

import type { RoutePalette } from "../types/route-palette";
import type { ShareBox } from "../types/share-box";

/** The route alone (no map) fitted into a square box (side = width), with a soft shadow for legibility. */
export function drawRouteTrace(
  ctx: CanvasRenderingContext2D,
  points: Array<[number, number]>,
  { x, y, width }: ShareBox,
  palette: RoutePalette,
): void {
  const view = fitMapView(points, width, width, 16);
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 12;
  drawRouteLine(ctx, points, view, palette);
  ctx.restore();
}
