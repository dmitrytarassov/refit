export function semicirclesToDeg(semicircles: number): number {
  return semicircles * (180 / 2 ** 31);
}

export function degToSemicircles(deg: number): number {
  return Math.round(deg / (180 / 2 ** 31));
}
