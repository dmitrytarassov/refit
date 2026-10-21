/** X axis length: the workout plus ten minutes, rounded up to a whole ten, never under an hour. */
export function axisSeconds(totalSeconds: number): number {
  return Math.max(3600, Math.ceil((totalSeconds + 600) / 600) * 600);
}

/** Tick spacing that keeps the axis at roughly six to twelve labels. */
export function axisTickStep(axis: number): number {
  if (axis <= 3600) {
    return 600;
  }
  return axis <= 7200 ? 1200 : 1800;
}
