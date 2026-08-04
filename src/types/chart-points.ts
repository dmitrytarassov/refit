/** `t` is seconds since the first record. */
export interface SeriesPoint {
  t: number;
  value: number;
}

export interface PowerPoint {
  t: number;
  original?: number;
  enhanced?: number;
}
