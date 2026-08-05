import type { HampelConfig } from "./hampel-config";
import { HAMPEL_SPEED_DEFAULTS } from "./hampel-speed-defaults";

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Two-sided Hampel over a device speed series: a sample deviating from the
 * window median by more than nSigmas robust sigmas is replaced with that
 * median (not dropped — the series keeps its shape for differentiation).
 * Gaps (`undefined`) pass through untouched.
 */
export function hampelSpeeds(
  speeds: Array<number | undefined>,
  cfg: HampelConfig = HAMPEL_SPEED_DEFAULTS,
): Array<number | undefined> {
  return speeds.map((speed, i) => {
    if (speed == null) {
      return speed;
    }
    const window: number[] = [];
    const lo = Math.max(0, i - cfg.windowHalf);
    const hi = Math.min(speeds.length - 1, i + cfg.windowHalf);
    for (let j = lo; j <= hi; j++) {
      const value = speeds[j];
      if (value != null) {
        window.push(value);
      }
    }
    if (window.length < 3) {
      return speed;
    }
    const med = median(window);
    const mad = median(window.map((value) => Math.abs(value - med)));
    const sigma = Math.max(1.4826 * mad, cfg.minSigmaMps);
    return Math.abs(speed - med) > cfg.nSigmas * sigma ? med : speed;
  });
}
