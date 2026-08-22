import type { ShareTileKey } from "../types/share-tile";

/** Display order of the share-image tiles; all are selected by default. */
export const SHARE_TILE_KEYS: ShareTileKey[] = [
  "movingTime",
  "distance",
  "avgSpeed",
  "maxSpeed",
  "avgHeartRate",
  "avgPower",
  "normalizedPower",
  "ftp",
  "tss",
];

/** Tiles selected by default in the Photo layout — the few that fit a photo story. */
export const SHARE_PHOTO_TILE_KEYS: ShareTileKey[] = [
  "movingTime",
  "distance",
  "avgSpeed",
  "avgPower",
];
