import type { FtpMethod } from "refit-core";

export interface RideFtp {
  watts: number;
  source: "manual" | "estimated";
  /** Present only for estimated FTP — which candidate won. */
  method?: FtpMethod;
}
