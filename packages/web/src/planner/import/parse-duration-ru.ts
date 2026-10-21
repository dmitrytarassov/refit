const DURATION_RU = /^(?:(\d+)\s*ч)?\s*(?:(\d+)\s*мин)?\s*(?:(\d+)\s*сек)?$/u;

/** "5 мин", "30 сек", "1 ч 5 мин" → seconds; null for anything else. */
export function parseDurationRu(line: string): number | null {
  const match = DURATION_RU.exec(line.trim());
  if (match == null || line.trim() === "") {
    return null;
  }
  const [, hours = "0", minutes = "0", seconds = "0"] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}
