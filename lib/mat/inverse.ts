import { identity } from "./create";
import type { Mat } from "./types";

/** Gauss-Jordan inverse with partial pivoting. Throws on singular input. */
export function inverse(a: Mat): Mat {
  const n = a.length;
  const eye = identity(n);
  const aug = a.map((row, i) => [...row, ...eye[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(aug[r][col]) > Math.abs(aug[pivot][col])) {
        pivot = r;
      }
    }
    if (Math.abs(aug[pivot][col]) < 1e-12) {
      throw new Error("Singular matrix");
    }
    [aug[col], aug[pivot]] = [aug[pivot], aug[col]];
    const div = aug[col][col];
    for (let j = 0; j < 2 * n; j++) {
      aug[col][j] /= div;
    }
    for (let r = 0; r < n; r++) {
      if (r === col) {
        continue;
      }
      const factor = aug[r][col];
      if (factor === 0) {
        continue;
      }
      for (let j = 0; j < 2 * n; j++) {
        aug[r][j] -= factor * aug[col][j];
      }
    }
  }
  return aug.map((row) => row.slice(n));
}
