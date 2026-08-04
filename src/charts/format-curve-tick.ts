export function formatCurveTick(durationSec: number): string {
  if (durationSec < 60) {
    return `${durationSec}s`;
  }
  if (durationSec < 3600) {
    return `${Math.round(durationSec / 60)}m`;
  }
  return `${Math.round(durationSec / 3600)}h`;
}
