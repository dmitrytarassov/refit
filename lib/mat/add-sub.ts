import type { Mat } from "./types";

export function matAdd(a: Mat, b: Mat): Mat {
  return a.map((row, i) => row.map((x, j) => x + b[i][j]));
}

export function matSub(a: Mat, b: Mat): Mat {
  return a.map((row, i) => row.map((x, j) => x - b[i][j]));
}
