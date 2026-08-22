import { loadTileImage } from "./load-tile-image";

import type { MapView } from "../types/map-view";

const TILE_SIZE = 256;

/** Draws OSM tiles covering the viewport; fractional zoom is handled by scaling the next integer level down. */
export async function drawMapTiles(
  ctx: CanvasRenderingContext2D,
  view: MapView,
  width: number,
  height: number,
): Promise<void> {
  const tileZoom = Math.min(19, Math.ceil(view.zoom));
  const scale = 2 ** (view.zoom - tileZoom);
  const drawn = TILE_SIZE * scale;
  const count = 2 ** tileZoom;
  const firstX = Math.floor(view.originX / drawn);
  const firstY = Math.floor(view.originY / drawn);
  const lastX = Math.floor((view.originX + width) / drawn);
  const lastY = Math.floor((view.originY + height) / drawn);

  const jobs: Array<Promise<void>> = [];
  for (let tx = firstX; tx <= lastX; tx++) {
    for (let ty = firstY; ty <= lastY; ty++) {
      if (ty < 0 || ty >= count) {
        continue;
      }
      const wrappedX = ((tx % count) + count) % count;
      const url = `https://tile.openstreetmap.org/${tileZoom}/${wrappedX}/${ty}.png`;
      const x = tx * drawn - view.originX;
      const y = ty * drawn - view.originY;
      jobs.push(
        loadTileImage(url).then((image) => {
          if (image != null) {
            ctx.drawImage(image, x, y, drawn + 0.5, drawn + 0.5);
          }
        }),
      );
    }
  }
  await Promise.all(jobs);
}
