/** Draws the image scaled to cover width × height, centered (CSS `object-fit: cover`). */
export function drawPhotoCover(
  ctx: CanvasRenderingContext2D,
  photo: HTMLImageElement,
  width: number,
  height: number,
): void {
  const scale = Math.max(width / photo.width, height / photo.height);
  const drawWidth = photo.width * scale;
  const drawHeight = photo.height * scale;
  ctx.drawImage(
    photo,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );
}
