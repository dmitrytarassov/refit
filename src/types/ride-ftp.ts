import type { FtpMethod } from "../../lib/power/ftp-estimate";

export interface RideFtp {
  watts: number;
  source: "manual" | "estimated";
  /** Present only for estimated FTP — which candidate won. */
  method?: FtpMethod;
}
