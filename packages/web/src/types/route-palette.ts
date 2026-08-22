export type RoutePaletteKey =
  "classic" | "sunset" | "forest" | "violet" | "graphite";

/** Start → finish colors of the route line gradient. */
export interface RoutePalette {
  start: string;
  end: string;
}
