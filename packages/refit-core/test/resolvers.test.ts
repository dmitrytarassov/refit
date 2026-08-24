import { describe, expect, test } from "bun:test";

import { CDA_BY_POSITION } from "../src/power/cda-by-position.js";
import { CRR_BY_SURFACE } from "../src/power/crr-by-surface.js";
import { PRESSURE_FACTOR } from "../src/power/pressure-factor.js";
import { resolveCda } from "../src/power/resolve-cda.js";
import { resolveCrr } from "../src/power/resolve-crr.js";
import { TIRE_FACTOR } from "../src/power/tire-factor.js";

describe("resolveCrr", () => {
  test("composes the three published tables for every combination", () => {
    for (const surface of Object.keys(CRR_BY_SURFACE) as Array<
      keyof typeof CRR_BY_SURFACE
    >) {
      for (const tires of Object.keys(TIRE_FACTOR) as Array<
        keyof typeof TIRE_FACTOR
      >) {
        for (const pressure of Object.keys(PRESSURE_FACTOR) as Array<
          keyof typeof PRESSURE_FACTOR
        >) {
          expect(resolveCrr({ surface, tires, pressure })).toBeCloseTo(
            CRR_BY_SURFACE[surface] *
              TIRE_FACTOR[tires] *
              PRESSURE_FACTOR[pressure],
            12,
          );
        }
      }
    }
  });

  test("gravel on MTB tyres at low pressure is four times road on good asphalt", () => {
    const worst = resolveCrr({
      surface: "gravel",
      tires: "mtb",
      pressure: "low",
    });
    const best = resolveCrr({
      surface: "good-asphalt",
      tires: "road",
      pressure: "high",
    });
    expect(worst).toBeCloseTo(0.018, 12);
    expect(best).toBeCloseTo(0.00405, 12);
  });
});

describe("resolveCda", () => {
  test("a fixed position ignores speed", () => {
    for (const position of Object.keys(CDA_BY_POSITION) as Array<
      keyof typeof CDA_BY_POSITION
    >) {
      expect(resolveCda(position, 5)).toBe(CDA_BY_POSITION[position]);
      expect(resolveCda(position, 20)).toBe(CDA_BY_POSITION[position]);
    }
  });

  test("auto switches from hoods to drops above 33 km/h", () => {
    const threshold = 33 / 3.6;
    expect(resolveCda("auto", threshold - 0.01)).toBe(CDA_BY_POSITION.hoods);
    expect(resolveCda("auto", threshold)).toBe(CDA_BY_POSITION.hoods);
    expect(resolveCda("auto", threshold + 0.01)).toBe(CDA_BY_POSITION.drops);
  });
});
