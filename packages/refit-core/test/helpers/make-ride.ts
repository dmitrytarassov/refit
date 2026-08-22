import { degToSemicircles } from "../../src/geo/semicircles.js";
import type { FitRecord } from "../../src/track/fit-record.js";

const ORIGIN_LAT_DEG = 55;
const ORIGIN_LON_DEG = 37;

/** Metres per degree of latitude — good enough for a synthetic straight track. */
const METERS_PER_LAT_DEG = 111_320;

interface RideOptions {
  n: number;
  speedMps: number;
  altitudeM?: number;
  tempC?: number;
}

/** A 1 Hz ride heading due north at constant speed on flat ground. */
export function makeRide({
  n,
  speedMps,
  altitudeM = 100,
  tempC = 20,
}: RideOptions): FitRecord[] {
  const t0 = Date.UTC(2026, 0, 1, 8, 0, 0);
  return Array.from({ length: n }, (_, i) => ({
    timestamp: new Date(t0 + i * 1000),
    positionLat: degToSemicircles(
      ORIGIN_LAT_DEG + (i * speedMps) / METERS_PER_LAT_DEG,
    ),
    positionLong: degToSemicircles(ORIGIN_LON_DEG),
    speed: speedMps,
    enhancedAltitude: altitudeM,
    temperature: tempC,
    grade: 0,
    cadence: 80,
    distance: i * speedMps,
  }));
}

/** Copy of the ride with one fix displaced north by `metersNorth`. */
export function shiftPoint(
  records: FitRecord[],
  index: number,
  metersNorth: number,
): FitRecord[] {
  return records.map((r, i) =>
    i === index
      ? {
          ...r,
          positionLat: degToSemicircles(
            (r.positionLat ?? 0) * (180 / 2 ** 31) +
              metersNorth / METERS_PER_LAT_DEG,
          ),
        }
      : r,
  );
}
