import { describe, expect, test } from "bun:test";

import { assertAutoCdaConfig } from "../src/power/assert-auto-cda-config.js";
import type { AutoCdaConfig } from "../src/power/auto-cda-config.js";
import {
  DEFAULT_AUTO_BLEND_MPS,
  DEFAULT_AUTO_CDA,
} from "../src/power/auto-cda-defaults.js";
import { CDA_BY_POSITION } from "../src/power/cda-by-position.js";
import { estimatePower } from "../src/power/estimate-power.js";
import { minBlendBandMps } from "../src/power/min-blend-band.js";
import { pointPowerW } from "../src/power/point-power.js";
import type { PowerConfig } from "../src/power/power-config.js";
import { resolveCda } from "../src/power/resolve-cda.js";
import type { FitRecord } from "../src/track/fit-record.js";

const CFG: PowerConfig = {
  mass: { bikeKg: 9, riderKg: 75, gearKg: 0 },
  cda: "auto",
  crr: { surface: "good-asphalt", tires: "road", pressure: "high" },
};

const HARD_SWITCH: AutoCdaConfig = { ...DEFAULT_AUTO_CDA, blendBandMps: 0 };

/** A 1 Hz flat ride whose speed ramps from `fromMps` to `toMps`. */
function ramp(fromMps: number, toMps: number, n: number): FitRecord[] {
  const t0 = Date.UTC(2026, 0, 1, 8, 0, 0);
  return Array.from({ length: n }, (_, i) => ({
    timestamp: new Date(t0 + i * 1000),
    speed: fromMps + ((toMps - fromMps) * i) / (n - 1),
    enhancedAltitude: 100,
    temperature: 20,
    grade: 0,
    cadence: 85,
  }));
}

describe("auto CdA ladder", () => {
  test("a zero band reproduces the 0.1.x hard switch", () => {
    const threshold = 33 / 3.6;
    for (let v = 0; v <= 80 / 3.6; v += 0.05) {
      const expected =
        v > threshold ? CDA_BY_POSITION.drops : CDA_BY_POSITION.hoods;
      expect(resolveCda(HARD_SWITCH, v)).toBe(expected);
    }
  });

  test("blending is continuous and stays between the neighbouring steps", () => {
    let previous = resolveCda("auto", 0);
    for (let v = 0; v <= 80 / 3.6; v += 0.01) {
      const cda = resolveCda("auto", v);
      expect(Math.abs(cda - previous)).toBeLessThan(1e-3);
      expect(cda).toBeLessThanOrEqual(CDA_BY_POSITION.hoods);
      expect(cda).toBeGreaterThanOrEqual(CDA_BY_POSITION.drops);
      previous = cda;
    }
  });

  test("power no longer drops when the rider crosses the threshold", () => {
    const across = ramp(30 / 3.6, 36 / 3.6, 120);
    const blended = estimatePower(across, CFG);
    for (let i = 1; i < blended.length; i++) {
      expect(blended[i] ?? 0).toBeGreaterThanOrEqual(blended[i - 1] ?? 0);
    }

    // The bug this replaces: +0.2 km/h used to cost ~9% of the power.
    const hard = estimatePower(across, { ...CFG, cda: HARD_SWITCH });
    const worstStep = hard.reduce<number>(
      (worst, watts, i) =>
        i > 0 ? Math.min(worst, (watts ?? 0) - (hard[i - 1] ?? 0)) : worst,
      0,
    );
    expect(worstStep).toBeLessThan(-10);
  });
});

describe("assertAutoCdaConfig", () => {
  test("accepts the default ladder", () => {
    expect(() => assertAutoCdaConfig(DEFAULT_AUTO_CDA)).not.toThrow();
    expect(() => assertAutoCdaConfig(HARD_SWITCH)).not.toThrow();
  });

  test("rejects a malformed ladder", () => {
    expect(() => assertAutoCdaConfig({ steps: [], blendBandMps: 0 })).toThrow(
      /steps must not be empty/,
    );
    expect(() =>
      assertAutoCdaConfig({
        steps: [{ position: "hoods", upToMps: 9 }],
        blendBandMps: 0,
      }),
    ).toThrow(/no upToMps/);
    expect(() =>
      assertAutoCdaConfig({
        steps: [
          { position: "tops", upToMps: 12 },
          { position: "hoods", upToMps: 9 },
          { position: "drops" },
        ],
        blendBandMps: 0,
      }),
    ).toThrow(/greater than step/);
    expect(() =>
      assertAutoCdaConfig({
        steps: [
          { position: "tops", upToMps: 8 },
          { position: "hoods", upToMps: 9 },
          { position: "drops" },
        ],
        blendBandMps: 2,
      }),
    ).toThrow(/overlaps the neighbouring boundary/);
  });

  test("rejects a band too narrow to keep power monotonic", () => {
    // hoods -> aero at 45 km/h: the default 4 km/h band is not enough.
    const boundary = 45 / 3.6;
    const needed = minBlendBandMps(
      CDA_BY_POSITION.hoods,
      CDA_BY_POSITION.aero,
      boundary,
    );
    expect(needed).toBeGreaterThan(DEFAULT_AUTO_BLEND_MPS);

    const tooNarrow: AutoCdaConfig = {
      steps: [{ position: "hoods", upToMps: boundary }, { position: "aero" }],
      blendBandMps: DEFAULT_AUTO_BLEND_MPS,
    };
    expect(() => assertAutoCdaConfig(tooNarrow)).toThrow(/too narrow/);
    expect(() =>
      assertAutoCdaConfig({ ...tooNarrow, blendBandMps: needed }),
    ).not.toThrow();
    expect(() =>
      assertAutoCdaConfig({ ...tooNarrow, blendBandMps: 0 }),
    ).not.toThrow();
  });

  test("the bound it enforces is the one power actually needs", () => {
    const boundary = 45 / 3.6;
    const needed = minBlendBandMps(
      CDA_BY_POSITION.hoods,
      CDA_BY_POSITION.aero,
      boundary,
    );
    const ladder = (blendBandMps: number): AutoCdaConfig => ({
      steps: [{ position: "hoods", upToMps: boundary }, { position: "aero" }],
      blendBandMps,
    });
    // estimatePower refuses the narrow ladder, so the demand is sampled
    // straight from the point model to show what the bound is protecting.
    const falls = (blendBandMps: number): boolean => {
      let previous = -Infinity;
      for (let v = 40 / 3.6; v <= 50 / 3.6; v += 0.01) {
        const watts = pointPowerW(
          {
            speedMps: v,
            accelMps2: 0,
            gradePercent: 0,
            altitudeM: 100,
            tempC: 20,
          },
          { ...CFG, cda: ladder(blendBandMps) },
        );
        if (watts < previous) {
          return true;
        }
        previous = watts;
      }
      return false;
    };

    expect(() =>
      estimatePower(ramp(40 / 3.6, 50 / 3.6, 60), {
        ...CFG,
        cda: ladder(needed * 0.6),
      }),
    ).toThrow(/too narrow/);
    expect(falls(needed * 0.6)).toBe(true);
    expect(falls(needed)).toBe(false);
  });
});
