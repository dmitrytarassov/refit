import { zeros } from "./create";
import type { Mat } from "./types";

export function transpose(a: Mat): Mat {
  const out = zeros(a[0].length, a.length);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[0].length; j++) {
      out[j][i] = a[i][j];
    }
  }
  return out;
}
