/**
 * Local equirectangular projection around a reference point.
 * Accurate to well under a meter for tracks up to ~100 km — enough for
 * outlier detection and smoothing, and cheaply invertible.
 */
export interface LocalProjection {
  toLocal(latDeg: number, lonDeg: number): { x: number; y: number };
  toGeo(x: number, y: number): { latDeg: number; lonDeg: number };
}
