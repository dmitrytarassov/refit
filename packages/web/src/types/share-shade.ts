/** Where the black shade goes on the photo share image. */
export type ShareShadeMode = "none" | "topBottom" | "bottom" | "full";

/** Shade settings: placement + peak opacity (0.1–0.5). */
export interface ShareShade {
  mode: ShareShadeMode;
  opacity: number;
}
