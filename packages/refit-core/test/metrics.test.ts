import { describe, expect, test } from "bun:test";

import { makeRide } from "./helpers/make-ride.js";

import { computePowerZones } from "../src/power/compute-power-zones.js";
import { computeTss } from "../src/power/compute-tss.js";
import { CURVE_DURATIONS_SEC } from "../src/power/curve-durations.js";
import { estimateFtp } from "../src/power/estimate-ftp.js";
import { normalizedPowerW } from "../src/power/normalized.js";
import { powerCurve } from "../src/power/power-curve.js";
import { sessionPowerStats } from "../src/power/session-stats.js";

describe("computeTss", () => {
  test("an hour at FTP is 100 TSS", () => {
    expect(computeTss(3600, 250, 250)).toBe(100);
    expect(computeTss(1800, 250, 250)).toBe(50);
    expect(computeTss(0, 250, 250)).toBe(0);
    expect(computeTss(3600, 250, 0)).toBe(0);
  });
});

describe("computePowerZones", () => {
  test("61 seconds at half FTP land in Z1; device power wins over the estimate", () => {
    const ride = makeRide({ n: 61, speedMps: 8 });
    const powers = ride.map(() => 125);
    const zones = computePowerZones(ride, powers, 250);
    expect(zones[0]).toEqual({ zone: "Z1", seconds: 60, fraction: 1 });
    expect(zones.slice(1).every((z) => z.seconds === 0)).toBe(true);

    const withDevice = ride.map((r) => ({ ...r, power: 300 }));
    expect(computePowerZones(withDevice, powers, 250)[4].seconds).toBe(60);
  });
});

describe("estimateFtp", () => {
  test("picks the largest lower bound among the methods", () => {
    expect(estimateFtp([{ durationSec: 1200, watts: 200 }])).toEqual({
      watts: 190,
      method: "twenty-min",
    });
    expect(
      estimateFtp([
        { durationSec: 300, watts: 300 },
        { durationSec: 1200, watts: 200 },
      ])?.method,
    ).toBe("twenty-min");
    expect(
      estimateFtp([
        { durationSec: 1200, watts: 200 },
        { durationSec: 3600, watts: 195 },
      ]),
    ).toEqual({ watts: 195, method: "best-hour" });
    expect(estimateFtp([{ durationSec: 300, watts: 300 }])).toBeNull();
  });
});

describe("normalizedPowerW / sessionPowerStats / powerCurve", () => {
  test("constant power is its own normalized power", () => {
    const samples = Array.from({ length: 120 }, (_, t) => ({ t, p: 200 }));
    expect(normalizedPowerW(samples)).toBeCloseTo(200, 6);
    expect(normalizedPowerW(samples.slice(0, 1))).toBeNull();
    expect(normalizedPowerW(samples.slice(0, 20))).toBeNull();

    const ride = makeRide({ n: 120, speedMps: 8 });
    expect(
      sessionPowerStats(
        ride,
        ride.map(() => 200),
      ),
    ).toEqual({
      avgPower: 200,
      maxPower: 200,
      normalizedPower: 200,
    });
    expect(
      sessionPowerStats(
        ride,
        ride.map(() => undefined),
      ),
    ).toBeNull();
  });

  test("constant 200 W over 3700 s gives a flat curve up to one hour", () => {
    const ride = makeRide({ n: 3700, speedMps: 8 });
    const curve = powerCurve(
      ride,
      ride.map(() => 200),
    );
    expect(curve.map((p) => p.durationSec)).toEqual(
      CURVE_DURATIONS_SEC.filter((d) => d <= 3700),
    );
    expect(curve.every((p) => p.watts === 200)).toBe(true);
  });
});
