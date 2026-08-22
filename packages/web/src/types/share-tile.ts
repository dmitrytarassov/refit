export type ShareTileKey =
  | "movingTime"
  | "distance"
  | "avgSpeed"
  | "maxSpeed"
  | "avgHeartRate"
  | "avgPower"
  | "normalizedPower"
  | "ftp"
  | "tss";

export interface ShareTile {
  key: ShareTileKey;
  label: string;
  value: string;
  unit?: string;
}
