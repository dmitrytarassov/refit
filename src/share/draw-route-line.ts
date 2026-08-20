import { projectLatLng } from "./project-lat-lng";

import type { MapView } from "../types/map-view";
import type { ShareCardPalette } from "../types/share-card-data";

export function drawRouteLine(
  ctx: CanvasRenderingContext2D,
  points: Array<[number, number]>,
  view: MapView,
  palette: ShareCardPalette,
): void {
  ctx.beginPath();
  points.forEach(([lat, lng], index) => {
    const { x, y } = projectLatLng(lat, lng, view.zoom);
    if (index === 0) {
      ctx.moveTo(x - view.originX, y - view.originY);
    } else {
      ctx.lineTo(x - view.originX, y - view.originY);
    }
  });
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = palette.routeOutline;
  ctx.lineWidth = 14;
  ctx.stroke();
  ctx.strokeStyle = palette.route;
  ctx.lineWidth = 8;
  ctx.stroke();
}
