import { lerpHexColor } from "./lerp-hex-color";

import type { RoutePalette } from "../types/route-palette";

/** Color of segment `index` out of `count` along the palette's start → finish gradient. */
export function routeSegmentColor(
  index: number,
  count: number,
  palette: RoutePalette,
): string {
  return lerpHexColor(
    palette.start,
    palette.end,
    count > 1 ? index / (count - 1) : 0,
  );
}
