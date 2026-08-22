export type CombinedMetricKey =
  "power" | "heartRate" | "cadence" | "elevation" | "speed";

/** `t` is seconds since the first record, `d` cumulative meters; one merged sample per record. */
export type CombinedPoint = { t: number; d?: number } & Partial<
  Record<CombinedMetricKey, number>
>;
