import { type PowerConfig } from "refit-core";

export interface CliOptions {
  input: string;
  output: string;
  smooth: boolean;
  /** Power estimation config; null when --power is not requested. */
  power: PowerConfig | null;
}
