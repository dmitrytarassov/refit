export interface Verdict {
  status: "accepted" | "rejected";
  rejectedBy?: "speed-gate" | "hampel" | "kalman";
  /** RTS-smoothed position (degrees), present for accepted points when kalman is on. */
  smoothed?: { latDeg: number; lonDeg: number };
}

export interface CleanResult {
  /** Verdict per recordMesgs index, only for records that have a GPS fix. */
  verdicts: Map<number, Verdict>;
  report: {
    totalRecords: number;
    withGps: number;
    rejectedBy: { "speed-gate": number; hampel: number; kalman: number };
    accepted: number;
  };
}
