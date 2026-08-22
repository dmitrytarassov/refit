import type { MassConfig } from "refit-core";

import { POWER_DEFAULTS } from "../../fit/power-defaults";

export function nextMass(
  mass: MassConfig | null,
  key: "riderKg" | "bikeKg" | "gearKg",
  raw: string,
): MassConfig | undefined {
  if (raw === "" && mass == null) {
    return undefined;
  }
  const value = raw === "" ? null : Number(raw);
  if (value != null && Number.isNaN(value)) {
    return undefined;
  }
  const next = { ...POWER_DEFAULTS.mass, ...mass };
  if (key === "riderKg") {
    next.riderKg = value ?? POWER_DEFAULTS.mass.riderKg;
  } else if (key === "bikeKg") {
    next.bikeKg = value ?? POWER_DEFAULTS.mass.bikeKg;
  } else {
    next.gearKg = value ?? POWER_DEFAULTS.mass.gearKg;
  }
  return next;
}
