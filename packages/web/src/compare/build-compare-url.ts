/** `/?view=compare&rides[]=1&rides[]=2` — the Compare page for the given rides. */
export function buildCompareUrl(ids: number[]): string {
  const params = new URLSearchParams({ view: "compare" });
  for (const id of ids) {
    params.append("rides[]", String(id));
  }
  return `/?${params.toString()}`;
}
