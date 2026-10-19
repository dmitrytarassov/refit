import type { ChartPalette } from "../types/chart-palette";
import type { CombinedMetricKey } from "../types/combined-point";

export const COMBINED_METRICS: ReadonlyArray<{
  key: CombinedMetricKey;
  /** the Y axis the series is drawn on — the recorded power shares the estimate's axis */
  axisKey: CombinedMetricKey;
  unitKey: "w" | "bpm" | "rpm" | "m" | "kmh";
  paletteKey: keyof ChartPalette;
  /** mirror the card style: gradient area fill instead of a bare line */
  gradient: boolean;
  dashed: boolean;
}> = [
  {
    key: "power",
    axisKey: "power",
    unitKey: "w",
    paletteKey: "enhanced",
    gradient: false,
    dashed: false,
  },
  {
    key: "powerOriginal",
    axisKey: "power",
    unitKey: "w",
    paletteKey: "original",
    gradient: false,
    dashed: true,
  },
  {
    key: "heartRate",
    axisKey: "heartRate",
    unitKey: "bpm",
    paletteKey: "heartRate",
    gradient: true,
    dashed: false,
  },
  {
    key: "cadence",
    axisKey: "cadence",
    unitKey: "rpm",
    paletteKey: "cadence",
    gradient: true,
    dashed: false,
  },
  {
    key: "elevation",
    axisKey: "elevation",
    unitKey: "m",
    paletteKey: "elevation",
    gradient: true,
    dashed: false,
  },
  {
    key: "speed",
    axisKey: "speed",
    unitKey: "kmh",
    paletteKey: "speed",
    gradient: true,
    dashed: false,
  },
];
