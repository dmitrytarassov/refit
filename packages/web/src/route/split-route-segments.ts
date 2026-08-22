/** Splits a polyline into `count` consecutive pieces; neighbours share their boundary point so there are no gaps. */
export function splitRouteSegments<T>(points: T[], count: number): T[][] {
  if (points.length < 2) {
    return [];
  }
  const pieces = Math.min(count, points.length - 1);
  const segments: T[][] = [];
  for (let i = 0; i < pieces; i++) {
    const start = Math.floor((i * (points.length - 1)) / pieces);
    const end = Math.floor(((i + 1) * (points.length - 1)) / pieces);
    segments.push(points.slice(start, end + 1));
  }
  return segments;
}
