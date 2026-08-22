import type { ShareCardPalette } from "../types/share-card-data";
import type { ThemeMode } from "../types/theme-mode";

export const SHARE_CARD_PALETTE: Record<ThemeMode, ShareCardPalette> = {
  light: {
    background: "#F5F6F9",
    card: "#FFFFFF",
    border: "#DFE3EB",
    text: "#161B33",
    textSecondary: "#646B7D",
    textMuted: "#8C93A5",
    ink: "#2A3572",
    inkOn: "#FFFFFF",
  },
  dark: {
    background: "#0F1220",
    card: "#171B2E",
    border: "#2A3049",
    text: "#E8EAF2",
    textSecondary: "#9AA1B8",
    textMuted: "#6E7590",
    ink: "#3D4A9E",
    inkOn: "#FFFFFF",
  },
};
