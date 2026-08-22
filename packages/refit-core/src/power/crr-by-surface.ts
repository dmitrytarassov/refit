import type { Surface } from "./surface.js";

/** Base rolling resistance coefficient by road surface. */
export const CRR_BY_SURFACE: Record<Surface, number> = {
  "good-asphalt": 0.0045,
  "rough-asphalt": 0.006,
  gravel: 0.01,
};
