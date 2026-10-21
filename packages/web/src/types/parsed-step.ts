/** A step as read from pasted workout text: watts of the band's midpoint, null when the text had no target. */
export interface ParsedStep {
  seconds: number;
  watts: number | null;
  note?: string;
}

/** A section's content in order: `N×` multipliers and the steps that follow them. */
export type ParsedItem =
  { kind: "times"; times: number } | { kind: "step"; step: ParsedStep };
