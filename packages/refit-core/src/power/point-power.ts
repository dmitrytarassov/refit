import { airDensityKgM3 } from "./air-density.js";
import { DEFAULT_DRIVETRAIN_EFFICIENCY } from "./drivetrain-efficiency.js";
import type { PointSample } from "./point-sample.js";
import type { PowerConfig } from "./power-config.js";
import { resolveCda } from "./resolve-cda.js";
import { resolveCrr } from "./resolve-crr.js";
import { totalMassKg } from "./total-mass.js";

/**
 * Pedal power for one sample: (gravity + rolling + aero + inertia) * v / efficiency.
 * Descents and braking produce negative demand — clamped to 0, you cannot
 * push negative watts through the pedals.
 */
export function pointPowerW(s: PointSample, cfg: PowerConfig): number {
  const g = 9.80665;
  const theta = Math.atan(s.gradePercent / 100);
  const m = totalMassKg(cfg.mass);

  const gravity = m * g * Math.sin(theta);
  const rolling = m * g * Math.cos(theta) * resolveCrr(cfg.crr);
  const aero =
    0.5 *
    airDensityKgM3(s.tempC, s.altitudeM) *
    resolveCda(cfg.cda, s.speedMps) *
    s.speedMps ** 2;
  const inertia = m * s.accelMps2;

  const demand =
    ((gravity + rolling + aero + inertia) * s.speedMps) /
    (cfg.drivetrainEfficiency ?? DEFAULT_DRIVETRAIN_EFFICIENCY);
  return Math.max(0, demand);
}
