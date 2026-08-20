import { SHARE_TILE_GAP, SHARE_TILE_HEIGHT } from "./share-tile-size";

/** Height of the three-column tile grid for a given tile count (0 for none). */
export function shareTilesHeight(count: number): number {
  const rows = Math.ceil(count / 3);
  return rows * SHARE_TILE_HEIGHT + Math.max(rows - 1, 0) * SHARE_TILE_GAP;
}
