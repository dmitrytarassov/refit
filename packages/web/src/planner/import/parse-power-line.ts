const WATTS_BAND = /^(\d+)(?:\s*[–-]\s*(\d+))?\s*Вт$/u;

/**
 * "141–151Вт" → the band's midpoint in watts, "—" → no target (null);
 * undefined when the line is not a power line at all.
 */
export function parsePowerLine(line: string): number | null | undefined {
  const text = line.trim();
  if (text === "—" || text === "–" || text === "-") {
    return null;
  }
  const match = WATTS_BAND.exec(text);
  if (match == null) {
    return undefined;
  }
  const low = Number(match[1]);
  const high = match[2] == null ? low : Number(match[2]);
  return Math.round((low + high) / 2);
}
