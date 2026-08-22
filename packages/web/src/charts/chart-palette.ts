import type { ChartPalette } from "../types/chart-palette";
import type { ThemeMode } from "../types/theme-mode";

export const CHART_PALETTE: Record<ThemeMode, ChartPalette> = {
  light: {
    original: "#A8AFC2",
    enhanced: "#C0891F",
    grid: "#E7EAF1",
    axis: "#646B7D",
    heartRate: "#B32D38",
    success: "#157F52",
    cadence: "#4A7BA8",
    power: "#2A3572",
    elevation: "#C7CDDA",
    speed: "#177E6E",
    tooltipBg: "#FFFFFF",
    tooltipBorder: "#DFE3EB",
    tooltipText: "#161B33",
    accent: "#7dff46",
  },
  dark: {
    original: "#565E78",
    enhanced: "#D9A33C",
    grid: "#2A3049",
    axis: "#9AA1B8",
    heartRate: "#B32D38",
    success: "#1FA06A",
    cadence: "#4A7BA8",
    power: "#8B99E8",
    elevation: "#C7CDDA",
    speed: "#2FA893",
    tooltipBg: "#171B2E",
    tooltipBorder: "#2A3049",
    tooltipText: "#E8EAF2",
    accent: "#7dff46",
  },
};
