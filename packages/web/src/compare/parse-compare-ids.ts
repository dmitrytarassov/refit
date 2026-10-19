/** Ride ids from `rides[]` query params — numeric, unique, at most two. */
export function parseCompareIds(params: URLSearchParams): number[] {
  const ids: number[] = [];
  for (const raw of params.getAll("rides[]")) {
    const id = Number(raw);
    if (Number.isInteger(id) && id > 0 && !ids.includes(id)) {
      ids.push(id);
    }
  }
  return ids.slice(0, 2);
}
