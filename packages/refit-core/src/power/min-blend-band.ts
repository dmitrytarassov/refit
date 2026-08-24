/**
 * Narrowest blend band, m/s, that keeps power non-decreasing across one
 * boundary of a speed ladder.
 *
 * Inside the band the aero term is CdA(v)·v³ with CdA falling linearly, so
 * power grows only while `CdA'(v)·v + 3·CdA(v) > 0`. That expression is
 * smallest at the top of the band, which gives
 * `band > ΔCdA · boundary / (3·cdaNext − ΔCdA/2)`.
 * Rolling and gravity add to the demand, so the bound is conservative.
 */
export function minBlendBandMps(
  cdaHere: number,
  cdaNext: number,
  boundaryMps: number,
): number {
  const drop = cdaHere - cdaNext;
  if (drop <= 0) {
    return 0;
  }
  const denominator = 3 * cdaNext - drop / 2;
  return denominator > 0 ? (drop * boundaryMps) / denominator : Infinity;
}
