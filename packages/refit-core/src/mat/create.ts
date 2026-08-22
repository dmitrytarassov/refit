import type { Mat } from "./types.js";

export function zeros(rows: number, cols: number): Mat {
  return Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
}

export function identity(n: number): Mat {
  const m = zeros(n, n);
  for (let i = 0; i < n; i++) {
    m[i][i] = 1;
  }
  return m;
}
