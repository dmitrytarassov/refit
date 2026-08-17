import type { ChartPalette } from "../types/chart-palette";
import type { CombinedMetricKey } from "../types/combined-point";

export const COMBINED_METRICS: ReadonlyArray<{
  key: CombinedMetricKey;
  name: string;
  unit: string;
  paletteKey: keyof ChartPalette;
  /** mirror the card style: gradient area fill instead of a bare line */
  gradient: boolean;
}> = [
  {
    key: "power",
    name: "Power",
    unit: "W",
    paletteKey: "enhanced",
    gradient: false,
  },
  {
    key: "heartRate",
    name: "Heart Rate",
    unit: "bpm",
    paletteKey: "heartRate",
    gradient: true,
  },
  {
    key: "cadence",
    name: "Cadence",
    unit: "rpm",
    paletteKey: "cadence",
    gradient: true,
  },
  {
    key: "elevation",
    name: "Elevation",
    unit: "m",
    paletteKey: "elevation",
    gradient: true,
  },
  {
    key: "speed",
    name: "Speed",
    unit: "km/h",
    paletteKey: "speed",
    gradient: true,
  },
];
