import { type PowerConfig } from "../lib/power/power-config";

export interface CliOptions {
  input: string;
  output: string;
  smooth: boolean;
  /** Power estimation config; null when --power is not requested. */
  power: PowerConfig | null;
}
