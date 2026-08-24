import { assertAutoCdaConfig } from "./assert-auto-cda-config.js";
import { fillSeries } from "./fill-series.js";
import { pointPowerW } from "./point-power.js";
import type { PowerConfig } from "./power-config.js";

import { hampelSpeeds } from "../filters/hampel-speed.js";
import { median3 } from "../filters/median3.js";
import type { FitRecord } from "../track/fit-record.js";

/**
 * Estimated power per record, aligned with the input array.
 * `undefined` — no speed data to estimate from; `0` — coasting (zero cadence),
 * standing still, or negative demand (descent/braking).
 */
export function estimatePower(
  records: FitRecord[],
  cfg: PowerConfig,
): Array<number | undefined> {
  if (typeof cfg.cda === "object") {
    assertAutoCdaConfig(cfg.cda);
  }

  const times = records.map((r) =>
    r.timestamp ? r.timestamp.getTime() / 1000 : undefined,
  );
  // Device speed is not touched by the GPS cleaning pipeline, and a single
  // glitched sample spikes both the aero term (~v³) and the acceleration
  // derivative — filter the series before any of it is used. The 3-point
  // median after Hampel kills one-sample V-dips that stay under the sigma
  // threshold yet blow up the central-difference acceleration.
  const speeds = median3(
    hampelSpeeds(records.map((r) => r.enhancedSpeed ?? r.speed)),
  );
  // Altitude and temperature drop out for seconds at a time (barometer glitch,
  // lost GPS fix). A constant fallback would model those records at sea level:
  // at 2000 m that overstates their power by about a quarter. Holes are
  // interpolated from the neighbouring records instead.
  const altitudes = fillSeries(
    records.map((r) => r.enhancedAltitude ?? r.altitude),
    times,
  );
  const temperatures = fillSeries(
    records.map((r) => r.temperature),
    times,
  );

  return records.map((r, i) => {
    const speed = speeds[i];
    if (speed == null) {
      return undefined;
    }
    if (speed < 0.5 || r.cadence === 0) {
      return 0;
    }

    // Central-difference acceleration; skipped across data holes and long gaps
    // (pauses), where a speed delta says nothing about actual acceleration.
    let accel = 0;
    const tCur = times[i];
    const tPrev = i > 0 ? times[i - 1] : undefined;
    const sPrev = i > 0 ? speeds[i - 1] : undefined;
    const tNext = i < records.length - 1 ? times[i + 1] : undefined;
    const sNext = i < records.length - 1 ? speeds[i + 1] : undefined;
    if (tCur != null) {
      const hasPrev = sPrev != null && tPrev != null;
      const hasNext = sNext != null && tNext != null;
      const dt = (hasNext ? tNext : tCur) - (hasPrev ? tPrev : tCur);
      if (dt > 0 && dt <= 10) {
        accel = Math.max(
          -3,
          Math.min(
            3,
            ((hasNext ? sNext : speed) - (hasPrev ? sPrev : speed)) / dt,
          ),
        );
      }
    }

    const watts = pointPowerW(
      {
        speedMps: speed,
        accelMps2: accel,
        gradePercent: r.grade ?? 0,
        altitudeM: altitudes[i] ?? 0,
        tempC: temperatures[i] ?? 15,
      },
      cfg,
    );
    return Math.min(Math.round(watts), 2000);
  });
}
