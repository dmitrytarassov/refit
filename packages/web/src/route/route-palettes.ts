import type { RoutePalette, RoutePaletteKey } from "../types/route-palette";

/** Order of the swatches in the map card; `classic` is the default. */
export const ROUTE_PALETTE_KEYS: RoutePaletteKey[] = [
  "classic",
  "sunset",
  "forest",
  "violet",
  "graphite",
];

export const ROUTE_PALETTES: Record<RoutePaletteKey, RoutePalette> = {
  classic: { start: "#0048ff", end: "#418bd4" },
  sunset: { start: "#ff3d00", end: "#ffc400" },
  forest: { start: "#00897b", end: "#aeea00" },
  violet: { start: "#6a00f4", end: "#ff2e88" },
  graphite: { start: "#1c1c1e", end: "#9a9aa3" },
};
