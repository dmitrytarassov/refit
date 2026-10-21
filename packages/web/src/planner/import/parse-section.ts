import { parseDurationRu } from "./parse-duration-ru";
import { parsePowerLine } from "./parse-power-line";

import type { ParsedItem, ParsedStep } from "../../types/parsed-step";

const TIMES = /^(\d+)\s*[×xхX]$/u;
const CADENCE = /^\d+(?:\s*[–-]\s*\d+)?$/u;

/**
 * Reads a section body line by line: a duration opens a step, a power line
 * sets its target, a bare number range is cadence (ignored), `N×` is a
 * multiplier, anything else is the current step's description.
 */
export function parseSection(lines: string[]): ParsedItem[] {
  const items: ParsedItem[] = [];
  let current: ParsedStep | null = null;
  for (const line of lines) {
    const times = TIMES.exec(line);
    if (times != null) {
      items.push({ kind: "times", times: Number(times[1]) });
      continue;
    }
    const seconds = parseDurationRu(line);
    if (seconds != null) {
      current = { seconds, watts: null };
      items.push({ kind: "step", step: current });
      continue;
    }
    if (current == null) {
      continue;
    }
    const watts = parsePowerLine(line);
    if (watts !== undefined) {
      current.watts = watts;
    } else if (!CADENCE.test(line)) {
      current.note = current.note == null ? line : `${current.note} ${line}`;
    }
  }
  return items;
}
