import { zeros } from "./create";
import type { Mat, Vec } from "./types";

export function matMul(a: Mat, b: Mat): Mat {
  const out = zeros(a.length, b[0].length);
  for (let i = 0; i < a.length; i++) {
    for (let k = 0; k < b.length; k++) {
      const aik = a[i][k];
      if (aik === 0) {
        continue;
      }
      for (let j = 0; j < b[0].length; j++) {
        out[i][j] += aik * b[k][j];
      }
    }
  }
  return out;
}

export function matVec(a: Mat, v: Vec): Vec {
  return a.map((row) => row.reduce((s, x, j) => s + x * v[j], 0));
}
