import type { ReactElement } from "react";

/** Shared vertical area-fill gradient: series color fading to transparent. Render inside <defs>. */
export function ChartFillGradient({
  id,
  color,
}: {
  id: string;
  color: string;
}): ReactElement {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={0.45} />
      <stop offset="100%" stopColor={color} stopOpacity={0.03} />
    </linearGradient>
  );
}
