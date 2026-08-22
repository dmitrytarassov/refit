export function downsamplePoints<T>(points: T[], maxPoints = 2000): T[] {
  if (points.length <= maxPoints) {
    return points;
  }
  const step = points.length / maxPoints;
  const out: T[] = [];
  for (let i = 0; i < maxPoints; i++) {
    out.push(points[Math.floor(i * step)]);
  }
  return out;
}
