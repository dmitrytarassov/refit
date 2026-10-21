import { parseSection } from "./import/parse-section";
import { sectionBlocks } from "./import/section-blocks";
import { splitSections } from "./import/split-sections";

import type { WorkoutBlock } from "../types/repeat-block";

/**
 * Pasted workout text (sections of "Разминка / 16:00 / ВРЕМЯ / МОЩНОСТЬ /
 * КАДЕНС · ОБ/МИН" followed by "5 мин / 140–151Вт" steps and `N×`
 * multipliers) → timeline blocks at the given FTP; null when no section is
 * recognised.
 */
export function parseWorkoutText(
  text: string,
  ftp: number,
): WorkoutBlock[] | null {
  const lines = text
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const sections = splitSections(lines);
  if (sections.length === 0) {
    return null;
  }
  return sections.flatMap((section) =>
    sectionBlocks(parseSection(section), ftp),
  );
}
