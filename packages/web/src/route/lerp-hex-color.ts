/** Linear RGB interpolation between two `#rrggbb` colors; t is clamped to [0, 1]. */
export function lerpHexColor(from: string, to: string, t: number): string {
  const k = Math.min(1, Math.max(0, t));
  const channel = (offset: number): string => {
    const a = parseInt(from.slice(offset, offset + 2), 16);
    const b = parseInt(to.slice(offset, offset + 2), 16);
    return Math.round(a + (b - a) * k)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(1)}${channel(3)}${channel(5)}`;
}
