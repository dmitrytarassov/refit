export interface ZoneTime {
  zone: string;
  seconds: number;
  /** Share of total in-zone time, 0..1. */
  fraction: number;
}
