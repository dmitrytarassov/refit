import type { WorkoutCaption } from "../types/workout-caption";

const CAPTION_LEVELS = 4;

/**
 * Vertical slot per caption marker so neighbours closer than 4% of the axis
 * stack instead of overlapping; a gap wider than that resets to the top row.
 */
export function captionLevels(
  captions: WorkoutCaption[],
  axis: number,
): number[] {
  const minGap = axis * 0.04;
  const levels: number[] = [];
  captions.forEach((caption, i) => {
    const previous = captions[i - 1];
    const close =
      previous != null && caption.atSeconds - previous.atSeconds < minGap;
    levels.push(close ? (levels[i - 1] + 1) % CAPTION_LEVELS : 0);
  });
  return levels;
}
