import { escapeXml } from "./escape-xml";

import type { WorkoutStep } from "../../types/workout-step";

/** Power attribute value: a fraction of FTP with up to three decimals. */
function power(fraction: number): string {
  return String(Number(fraction.toFixed(3)));
}

/**
 * One ZWO element for a plain step: `SteadyState`, `Warmup` / `Cooldown`
 * for a ramp up / down, `FreeRide`; a note becomes a `textevent` at the
 * step's start.
 */
export function stepToZwo(step: WorkoutStep): string {
  let open: string;
  if (step.kind === "free") {
    open = `<FreeRide Duration="${step.seconds}"`;
  } else if (step.kind === "ramp") {
    const tag = step.to >= step.from ? "Warmup" : "Cooldown";
    open = `<${tag} Duration="${step.seconds}" PowerLow="${power(step.from)}" PowerHigh="${power(step.to)}"`;
  } else {
    open = `<SteadyState Duration="${step.seconds}" Power="${power(step.from)}"`;
  }
  const note = step.note?.trim() ?? "";
  if (note === "") {
    return `    ${open}/>`;
  }
  const tag = open.slice(1, open.indexOf(" "));
  return `    ${open}>\n      <textevent timeoffset="0" message="${escapeXml(note)}"/>\n    </${tag}>`;
}
