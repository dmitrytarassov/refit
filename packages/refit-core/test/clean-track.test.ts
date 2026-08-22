import { describe, expect, test } from "bun:test";

import { makeRide, shiftPoint } from "./helpers/make-ride.js";

import { semicirclesToDeg } from "../src/geo/semicircles.js";
import { cleanTrack } from "../src/pipeline/clean-track.js";
import { DEFAULT_PIPELINE } from "../src/pipeline/pipeline-defaults.js";

describe("cleanTrack", () => {
  test("keeps every point of a clean track and smooths within 3 m", () => {
    const ride = makeRide({ n: 600, speedMps: 8 });
    const { verdicts, report } = cleanTrack(ride);

    expect(report).toEqual({
      totalRecords: 600,
      withGps: 600,
      rejectedBy: { "speed-gate": 0, hampel: 0, kalman: 0 },
      accepted: 600,
    });
    expect(verdicts.size).toBe(600);
    for (const [index, verdict] of verdicts) {
      expect(verdict.status).toBe("accepted");
      const trueLat = semicirclesToDeg(ride[index].positionLat ?? 0);
      const errorM =
        Math.abs((verdict.smoothed?.latDeg ?? 0) - trueLat) * 111_320;
      expect(errorM).toBeLessThan(3);
    }
  });

  test("rejects a 500 m teleport by the speed gate", () => {
    const ride = shiftPoint(makeRide({ n: 600, speedMps: 8 }), 300, 500);
    const { verdicts, report } = cleanTrack(ride);

    expect(report.rejectedBy).toEqual({
      "speed-gate": 1,
      hampel: 0,
      kalman: 0,
    });
    expect(report.accepted).toBe(599);
    expect(verdicts.get(300)).toEqual({
      status: "rejected",
      rejectedBy: "speed-gate",
    });
    expect(verdicts.get(299)?.status).toBe("accepted");
    expect(verdicts.get(301)?.status).toBe("accepted");
  });

  test("rejects a 100 m jump by Hampel when the speed gate is off", () => {
    const ride = shiftPoint(makeRide({ n: 600, speedMps: 8 }), 300, 100);
    const { verdicts, report } = cleanTrack(ride, {
      ...DEFAULT_PIPELINE,
      speedGate: false,
    });

    expect(report.rejectedBy).toEqual({
      "speed-gate": 0,
      hampel: 1,
      kalman: 0,
    });
    expect(verdicts.get(300)?.rejectedBy).toBe("hampel");
  });

  test("reports no GPS for records without positions", () => {
    const noGps = makeRide({ n: 10, speedMps: 8 }).map(
      ({ positionLat: _lat, positionLong: _lon, ...rest }) => rest,
    );
    expect(cleanTrack([]).report.withGps).toBe(0);
    expect(cleanTrack(noGps).report).toEqual({
      totalRecords: 10,
      withGps: 0,
      rejectedBy: { "speed-gate": 0, hampel: 0, kalman: 0 },
      accepted: 0,
    });
  });
});
