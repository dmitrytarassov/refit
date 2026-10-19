/**
 * The compared ids with `slot` set to `id`. A gap cannot be carried in the
 * URL, so picking the second slot while the first is empty makes that ride
 * the first one.
 */
export function replaceCompareId(
  ids: number[],
  slot: number,
  id: number,
): number[] {
  const next: Array<number | undefined> = [...ids];
  next[slot] = id;
  return next.filter((value): value is number => value != null);
}
