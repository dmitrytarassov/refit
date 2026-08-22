/** `t` is seconds since the first record; `d` is cumulative distance in meters. */
export interface SeriesPoint {
  t: number;
  value: number;
  d?: number;
}

export interface PowerPoint {
  t: number;
  original?: number;
  enhanced?: number;
  d?: number;
}
