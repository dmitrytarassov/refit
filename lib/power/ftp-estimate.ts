export type FtpMethod = "twenty-min" | "critical-power" | "best-hour";

export interface FtpEstimate {
  watts: number;
  method: FtpMethod;
}
