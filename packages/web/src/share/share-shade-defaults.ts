import type { ShareShade, ShareShadeMode } from "../types/share-shade";

/** Order of the shade mode select in the share modal. */
export const SHARE_SHADE_MODES: ShareShadeMode[] = [
  "none",
  "topBottom",
  "bottom",
  "full",
];

export const SHARE_SHADE_DEFAULT: ShareShade = { mode: "bottom", opacity: 0.4 };
