import type { ChartPalette } from "../types/chart-palette";
import type { CombinedMetricKey } from "../types/combined-point";

export const COMBINED_METRICS: ReadonlyArray<{
  key: CombinedMetricKey;
  unitKey: "w" | "bpm" | "rpm" | "m" | "kmh";
  paletteKey: keyof ChartPalette;
  /** mirror the card style: gradient area fill instead of a bare line */
  gradient: boolean;
}> = [
  { key: "power", unitKey: "w", paletteKey: "enhanced", gradient: false },
  { key: "heartRate", unitKey: "bpm", paletteKey: "heartRate", gradient: true },
  { key: "cadence", unitKey: "rpm", paletteKey: "cadence", gradient: true },
  { key: "elevation", unitKey: "m", paletteKey: "elevation", gradient: true },
  { key: "speed", unitKey: "kmh", paletteKey: "speed", gradient: true },
];
