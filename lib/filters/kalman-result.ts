export interface KalmanResult {
  rejected: Set<number>;
  /** RTS-smoothed positions for accepted points, keyed by recordIndex. */
  smoothed: Map<number, { x: number; y: number }>;
}
