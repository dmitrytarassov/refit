import type { Vec } from "./types.js";

export function vecAdd(a: Vec, b: Vec): Vec {
  return a.map((x, i) => x + b[i]);
}

export function vecSub(a: Vec, b: Vec): Vec {
  return a.map((x, i) => x - b[i]);
}
