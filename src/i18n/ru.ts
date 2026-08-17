import { CHARTS_RU } from "./ru/charts";
import { COMMON_RU } from "./ru/common";
import { DASHBOARD_RU } from "./ru/dashboard";
import { ERRORS_RU } from "./ru/errors";
import { HELP_RU } from "./ru/help";
import { HISTORY_RU } from "./ru/history";
import { LANGUAGE_RU } from "./ru/language";
import { METRIC_HELP_RU } from "./ru/metric-help";
import { NAV_RU } from "./ru/nav";
import { POWER_SETTINGS_RU } from "./ru/power-settings";
import { SETTINGS_RU } from "./ru/settings";
import { SIDEBAR_RU } from "./ru/sidebar";
import type { Translation } from "./translation";

export const RU: Translation = {
  locale: "ru-RU",
  common: COMMON_RU,
  nav: NAV_RU,
  language: LANGUAGE_RU,
  sidebar: SIDEBAR_RU,
  dashboard: DASHBOARD_RU,
  metricHelp: METRIC_HELP_RU,
  charts: CHARTS_RU,
  history: HISTORY_RU,
  settings: SETTINGS_RU,
  powerSettings: POWER_SETTINGS_RU,
  errors: ERRORS_RU,
  help: HELP_RU,
};
