import { projectLatLng } from "./project-lat-lng";

import { routeSegmentColor } from "../route/route-segment-color";
import { ROUTE_SEGMENT_COUNT } from "../route/route-segment-count";
import { splitRouteSegments } from "../route/split-route-segments";
import type { MapView } from "../types/map-view";
import type { RoutePalette } from "../types/route-palette";

function tracePath(
  ctx: CanvasRenderingContext2D,
  points: Array<[number, number]>,
  view: MapView,
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
}

/** 100 pieces colored along the start → finish gradient. */
export function drawRouteLine(
  ctx: CanvasRenderingContext2D,
  points: Array<[number, number]>,
  view: MapView,
  palette: RoutePalette,
): void {
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const segments = splitRouteSegments(points, ROUTE_SEGMENT_COUNT);
  segments.forEach((segment, index) => {
    tracePath(ctx, segment, view);
    ctx.strokeStyle = routeSegmentColor(index, segments.length, palette);
    ctx.lineWidth = 8;
    ctx.stroke();
  });
}
