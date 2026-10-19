import {
  cleanTrack,
  estimatePower,
  type FitRecord,
  sessionPowerStats,
} from "refit-core";

import { POWER_DEFAULTS } from "./power-defaults";

import type { Activity } from "../types/activity";
import type { RideSettings } from "../types/ride-settings";

/** The whole pipeline for one file: decode → clean → power → stats. */
export async function decodeActivity(
  buffer: ArrayBuffer,
  fileName: string,
  settings: RideSettings,
): Promise<Activity> {
  const { decodeFit } = await import("refit-core/fit");
  const fit = decodeFit(new Uint8Array(buffer));
  const records: FitRecord[] = fit.messages.recordMesgs ?? [];
  const { verdicts, report } = cleanTrack(records);
  const powers = estimatePower(records, {
    ...POWER_DEFAULTS,
    mass: settings.mass ?? POWER_DEFAULTS.mass,
    cda: settings.cda,
    crr: settings.crr,
  });
  const powerStats = sessionPowerStats(records, powers);
  return {
    fileName,
    fit,
    records,
    verdicts,
    report,
    powers,
    powerStats,
    settings,
  };
}
