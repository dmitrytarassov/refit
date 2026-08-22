import type { ShareShade } from "./share-shade";
import type { ShareVariant } from "./share-variant";
import type { ThemeMode } from "./theme-mode";

/** What the share image render depends on besides the data and tiles. */
export interface ShareRenderOptions {
  mode: ThemeMode;
  variant: ShareVariant;
  photo: HTMLImageElement | null;
  shade: ShareShade;
}
