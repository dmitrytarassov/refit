import { projectLatLng } from "./project-lat-lng";

import type { MapView } from "../types/map-view";

const MAX_ZOOM = 18;

/** Picks the zoom and origin so that all points fit into width × height with the given padding. */
export function fitMapView(
  points: Array<[number, number]>,
  width: number,
  height: number,
  padding: number,
): MapView {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (const [lat, lng] of points) {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  }
  const a = projectLatLng(maxLat, minLng, 0);
  const b = projectLatLng(minLat, maxLng, 0);
  const spanX = Math.max(b.x - a.x, 1e-6);
  const spanY = Math.max(b.y - a.y, 1e-6);
  const zoom = Math.min(
    MAX_ZOOM,
    Math.log2(
      Math.min((width - 2 * padding) / spanX, (height - 2 * padding) / spanY),
    ),
  );
  const scale = 2 ** zoom;
  const centerX = ((a.x + b.x) / 2) * scale;
  const centerY = ((a.y + b.y) / 2) * scale;
  return {
    zoom,
    originX: centerX - width / 2,
    originY: centerY - height / 2,
  };
}
