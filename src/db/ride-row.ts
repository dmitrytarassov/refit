import type { RideSettings } from "../types/ride-settings";

export interface RideRow {
  id?: number;
  fileName: string;
  createdAt: number;
  durationSec: number;
  distanceM: number;
  avgPower?: number;
  normalizedPower?: number;
  ftpWatts?: number;
  tss?: number;
  settings?: RideSettings;
  track?: Array<[number, number]>;
  file: ArrayBuffer;
}
