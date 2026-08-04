import type { Vec } from "./types";

export function vecAdd(a: Vec, b: Vec): Vec {
  return a.map((x, i) => x + b[i]);
}

export function vecSub(a: Vec, b: Vec): Vec {
  return a.map((x, i) => x - b[i]);
}
