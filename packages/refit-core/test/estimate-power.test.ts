import { describe, expect, test } from "bun:test";

import { makeRide } from "./helpers/make-ride.js";

import { airDensityKgM3 } from "../src/power/air-density.js";
import { estimatePower } from "../src/power/estimate-power.js";
import { pointPowerW } from "../src/power/point-power.js";
import type { PowerConfig } from "../src/power/power-config.js";

const CFG: PowerConfig = {
  mass: { bikeKg: 8, riderKg: 82, gearKg: 2 },
  cda: "hoods",
  crr: { surface: "good-asphalt", tires: "road", pressure: "high" },
};

describe("estimatePower", () => {
  test("flat constant speed matches the aero + rolling formula", () => {
    const ride = makeRide({ n: 120, speedMps: 10 });
    const powers = estimatePower(ride, CFG);

    const expected = pointPowerW(
      {
        speedMps: 10,
        accelMps2: 0,
        gradePercent: 0,
        altitudeM: 100,
        tempC: 20,
      },
      CFG,
    );
    const m = 92;
    const crr = 0.0045 * 1.0 * 0.9;
    const cda = 0.32;
    const rho = airDensityKgM3(20, 100);
    const byHand =
      ((m * 9.80665 * crr + 0.5 * rho * cda * 10 ** 2) * 10) / 0.975;

    expect(expected).toBeCloseTo(byHand, 6);
    for (const watts of powers.slice(10, 110)) {
      expect(watts).toBe(Math.round(expected));
    }
  });

  test("zero cadence, standing still and missing speed", () => {
    const ride = makeRide({ n: 60, speedMps: 10 });
    ride[30] = { ...ride[30], cadence: 0 };
    ride[40] = { ...ride[40], speed: undefined };
    const powers = estimatePower(ride, CFG);
    expect(powers[30]).toBe(0);
    expect(powers[40]).toBeUndefined();

    // A single slow sample is a speed glitch and gets filtered; a stretch is a stop.
    const stopped = makeRide({ n: 60, speedMps: 10 }).map((r, i) =>
      i >= 25 && i <= 35 ? { ...r, speed: 0.3 } : r,
    );
    expect(estimatePower(stopped, CFG)[30]).toBe(0);
  });

  test("steep descent clamps to zero, mass and position scale demand, cap at 2000 W", () => {
    const ride = makeRide({ n: 60, speedMps: 10 });
    const descent = ride.map((r) => ({ ...r, grade: -10 }));
    expect(estimatePower(descent, CFG)[30]).toBe(0);

    const flat = estimatePower(ride, CFG)[30] ?? 0;
    const heavier =
      estimatePower(ride, {
        ...CFG,
        mass: { ...CFG.mass, riderKg: 100 },
      })[30] ?? 0;
    const aero = estimatePower(ride, { ...CFG, cda: "aero" })[30] ?? 0;
    expect(heavier).toBeGreaterThan(flat);
    expect(aero).toBeLessThan(flat);

    const sprint = makeRide({ n: 60, speedMps: 40 });
    expect(estimatePower(sprint, CFG)[30]).toBe(2000);
  });

  test("missing grade is derived from altitude over distance; device grade wins", () => {
    // 10 m/s, +0.5 m per record: a 5 % climb written without a grade field.
    const climb = makeRide({ n: 60, speedMps: 10 }).map((r, i) => ({
      ...r,
      grade: undefined,
      enhancedAltitude: 100 + i * 0.5,
    }));
    const withGrade = climb.map((r) => ({ ...r, grade: 5 }));
    expect(estimatePower(climb, CFG)[30]).toBe(
      estimatePower(withGrade, CFG)[30],
    );
    expect(estimatePower(climb, CFG)[30] ?? 0).toBeGreaterThan(
      estimatePower(makeRide({ n: 60, speedMps: 10 }), CFG)[30] ?? 0,
    );

    // The device's own grade is trusted over the derived one.
    const flatByDevice = climb.map((r) => ({ ...r, grade: 0 }));
    expect(estimatePower(flatByDevice, CFG)[30]).toBe(
      Math.round(
        pointPowerW(
          {
            speedMps: 10,
            accelMps2: 0,
            gradePercent: 0,
            altitudeM: 115,
            tempC: 20,
          },
          CFG,
        ),
      ),
    );
  });
});
