import { SHARE_CARD_HEIGHT, SHARE_CARD_WIDTH } from "./share-card-size";

import type { ShareShade } from "../types/share-shade";

/**
 * Black shade for text legibility. `topEnd` — where the top gradient fades to zero
 * (below the title), `bottomStart` — where the bottom gradient starts from zero (above the stats).
 */
export function drawShareShade(
  ctx: CanvasRenderingContext2D,
  { mode, opacity }: ShareShade,
  topEnd: number,
  bottomStart: number,
): void {
  if (mode === "none") {
    return;
  }
  if (mode === "full") {
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);
    return;
  }
  if (mode === "topBottom") {
    const top = ctx.createLinearGradient(0, 0, 0, topEnd);
    top.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
    top.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, SHARE_CARD_WIDTH, topEnd);
  }
  const bottom = ctx.createLinearGradient(0, bottomStart, 0, SHARE_CARD_HEIGHT);
  bottom.addColorStop(0, "rgba(0, 0, 0, 0)");
  bottom.addColorStop(1, `rgba(0, 0, 0, ${opacity})`);
  ctx.fillStyle = bottom;
  ctx.fillRect(
    0,
    bottomStart,
    SHARE_CARD_WIDTH,
    SHARE_CARD_HEIGHT - bottomStart,
  );
}
