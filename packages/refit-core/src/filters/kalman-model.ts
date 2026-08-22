import type { Mat } from "../mat/types.js";

export function transition(dt: number): Mat {
  return [
    [1, 0, dt, 0],
    [0, 1, 0, dt],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

export function processNoise(dt: number, accelSigma: number): Mat {
  const q = accelSigma * accelSigma;
  const dt2 = dt * dt;
  const q11 = (q * dt2 * dt2) / 4;
  const q13 = (q * dt2 * dt) / 2;
  const q33 = q * dt2;
  return [
    [q11, 0, q13, 0],
    [0, q11, 0, q13],
    [q13, 0, q33, 0],
    [0, q13, 0, q33],
  ];
}
