/** The three column headers that open every section's step list. */
function isSectionHeader(lines: string[], i: number): boolean {
  return (
    lines[i] === "ВРЕМЯ" &&
    lines[i + 1] === "МОЩНОСТЬ" &&
    (lines[i + 2]?.startsWith("КАДЕНС") ?? false)
  );
}

/**
 * Splits the non-empty lines of a pasted workout into section bodies: the
 * lines after each ВРЕМЯ / МОЩНОСТЬ / КАДЕНС header, up to the next
 * section's name and duration (the two lines before its header).
 */
export function splitSections(lines: string[]): string[][] {
  const starts = lines
    .map((_, i) => i)
    .filter((i) => isSectionHeader(lines, i));
  return starts.map((start, n) => {
    const next = starts[n + 1];
    const end = next == null ? lines.length : next - 2;
    return lines.slice(start + 3, end);
  });
}
