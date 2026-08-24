/**
 * Fills holes in a per-record series (altitude, temperature) instead of
 * dropping to a constant: a barometer or GPS blackout of a few seconds should
 * not be modelled as sea level. Known values are interpolated in time; the
 * edges carry the nearest known value. A series with nothing known is
 * returned as it came, for the caller to substitute its own default.
 */
export function fillSeries(
  values: Array<number | undefined>,
  timesSec: Array<number | undefined>,
): Array<number | undefined> {
  const known = values.map((v, i) => (v === undefined ? -1 : i));
  const before: Array<number> = [];
  let seen = -1;
  for (let i = 0; i < values.length; i++) {
    if (known[i] >= 0) {
      seen = i;
    }
    before.push(seen);
  }
  const after: Array<number> = new Array<number>(values.length);
  seen = -1;
  for (let i = values.length - 1; i >= 0; i--) {
    if (known[i] >= 0) {
      seen = i;
    }
    after[i] = seen;
  }

  return values.map((value, i) => {
    if (value !== undefined) {
      return value;
    }
    const lo = before[i];
    const hi = after[i];
    if (lo < 0 && hi < 0) {
      return undefined;
    }
    if (lo < 0) {
      return values[hi];
    }
    if (hi < 0) {
      return values[lo];
    }
    const from = values[lo] ?? 0;
    const to = values[hi] ?? 0;
    const tLo = timesSec[lo];
    const tHi = timesSec[hi];
    const t = timesSec[i];
    const byTime =
      tLo !== undefined && tHi !== undefined && t !== undefined && tHi > tLo
        ? (t - tLo) / (tHi - tLo)
        : (i - lo) / (hi - lo);
    return from + (to - from) * byTime;
  });
}
