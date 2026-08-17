import { getLastSettings } from "./get-last-settings";
import { getMassSettings } from "./get-mass-settings";

import type { RideSettings } from "../types/ride-settings";

export async function resolveRideSettings(
  stored?: RideSettings,
): Promise<RideSettings> {
  const base = stored ?? (await getLastSettings());
  if (base.mass != null) {
    return base;
  }
  const mass = await getMassSettings();
  return mass != null ? { ...base, mass } : base;
}
