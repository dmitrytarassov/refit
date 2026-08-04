import type { LocalProjection } from "./local-projection";

export function createProjection(
  refLatDeg: number,
  refLonDeg: number,
): LocalProjection {
  const EARTH_RADIUS_M = 6371000;
  const DEG_TO_RAD = Math.PI / 180;
  const cosRefLat = Math.cos(refLatDeg * DEG_TO_RAD);
  return {
    toLocal(latDeg, lonDeg) {
      return {
        x: (lonDeg - refLonDeg) * DEG_TO_RAD * EARTH_RADIUS_M * cosRefLat,
        y: (latDeg - refLatDeg) * DEG_TO_RAD * EARTH_RADIUS_M,
      };
    },
    toGeo(x, y) {
      return {
        latDeg: refLatDeg + y / EARTH_RADIUS_M / DEG_TO_RAD,
        lonDeg: refLonDeg + x / (EARTH_RADIUS_M * cosRefLat) / DEG_TO_RAD,
      };
    },
  };
}
