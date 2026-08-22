import { describe, expect, test } from "bun:test";

import { fileURLToPath } from "node:url";

import { decodeFit } from "../src/fit/decode-fit.js";
import { encodeFit } from "../src/fit/encode-fit.js";
import { readFit } from "../src/fit/read-fit.js";
import { applyEnhancements } from "../src/pipeline/apply-enhancements.js";
import { cleanTrack } from "../src/pipeline/clean-track.js";
import { estimatePower } from "../src/power/estimate-power.js";
import { sessionPowerStats } from "../src/power/session-stats.js";

/** The demo ride shipped with the web app; the numbers below are the ones docs/cli.md shows. */
const DEMO_RIDE = fileURLToPath(
  new URL(
    "../../web/public/examples/MAGENE_C406_2026-08-04_075249_50559196_1785825837.fit",
    import.meta.url,
  ),
);

describe("demo ride", () => {
  test("cleaning and power match the documented CLI output, and the file round-trips", () => {
    const { ordered, messages, errors } = readFit(DEMO_RIDE);
    expect(errors).toEqual([]);
    const records = messages.recordMesgs;
    expect(records).toHaveLength(5548);

    const { verdicts, report } = cleanTrack(records);
    expect(report).toEqual({
      totalRecords: 5548,
      withGps: 3670,
      rejectedBy: { "speed-gate": 267, hampel: 117, kalman: 0 },
      accepted: 3286,
    });

    const powers = estimatePower(records, {
      mass: { bikeKg: 8, riderKg: 82, gearKg: 2 },
      cda: "auto",
      crr: { surface: "good-asphalt", tires: "road", pressure: "high" },
    });
    const powerStats = sessionPowerStats(records, powers);
    expect(powerStats).toEqual({
      avgPower: 140,
      normalizedPower: 180,
      maxPower: 735,
    });

    applyEnhancements(ordered, { verdicts, smooth: false, powers, powerStats });
    const again = decodeFit(new Uint8Array(encodeFit(ordered)));
    expect(again.errors).toEqual([]);
    expect(again.messages.recordMesgs).toHaveLength(5548);
    expect(
      again.messages.recordMesgs.filter(
        (r: { positionLat?: number }) => r.positionLat != null,
      ),
    ).toHaveLength(3286);
    expect(again.messages.sessionMesgs[0].avgPower).toBe(140);
  });
});
