import { escapeXml } from "./escape-xml";
import { stepToZwo } from "./step-to-zwo";

import type { WorkoutBlock } from "../../types/repeat-block";
import { expandBlocks } from "../expand-blocks";

/**
 * Zwift / MyWhoosh workout file: repeats unrolled into plain elements,
 * targets as fractions of FTP, notes as text events.
 */
export function buildZwo(name: string, blocks: WorkoutBlock[]): string {
  const steps = expandBlocks(blocks).map(stepToZwo).join("\n");
  return [
    "<workout_file>",
    "  <author>ReFit</author>",
    `  <name>${escapeXml(name)}</name>`,
    "  <description></description>",
    "  <sportType>bike</sportType>",
    "  <tags></tags>",
    "  <workout>",
    steps,
    "  </workout>",
    "</workout_file>",
    "",
  ].join("\n");
}
