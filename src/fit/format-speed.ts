export function formatSpeed(
  distanceM: number,
  durationSec: number,
  unit = "km/h",
): string {
  if (durationSec <= 0) {
    return "—";
  }
  return `${(distanceM / 1000 / (durationSec / 3600)).toFixed(1)} ${unit}`;
}
