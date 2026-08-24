import { describe, expect, test } from "bun:test";

import { makeRide } from "./helpers/make-ride.js";

import { estimatePower } from "../src/power/estimate-power.js";
import { fillSeries } from "../src/power/fill-series.js";
import type { PowerConfig } from "../src/power/power-config.js";

const CFG: PowerConfig = {
  mass: { bikeKg: 8, riderKg: 82, gearKg: 2 },
  cda: "hoods",
  crr: { surface: "good-asphalt", tires: "road", pressure: "high" },
};

describe("fillSeries", () => {
  test("interpolates holes in time and carries the edges", () => {
    const times = [0, 1, 2, 3, 4, 5];
    const values = [undefined, 100, undefined, undefined, 130, undefined];
    expect(fillSeries(values, times)).toEqual([100, 100, 110, 120, 130, 130]);
  });

  test("uneven sampling weights by time, not by index", () => {
    expect(fillSeries([0, undefined, 100], [0, 8, 10])).toEqual([0, 80, 100]);
  });

  test("a series with nothing known is left to the caller", () => {
    expect(fillSeries([undefined, undefined], [0, 1])).toEqual([
      undefined,
      undefined,
    ]);
  });
});

describe("estimatePower with holes in altitude", () => {
  test("a barometer dropout no longer models the point at sea level", () => {
    const ride = makeRide({ n: 60, speedMps: 12, altitudeM: 2000 });
    const withHole = ride.map((r, i) =>
      i === 30 ? { ...r, enhancedAltitude: undefined } : r,
    );

    const full = estimatePower(ride, CFG);
    const patched = estimatePower(withHole, CFG);
    expect(patched[30]).toBe(full[30]);
  });
});
