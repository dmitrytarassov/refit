import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import "./DefaultMassAlert.css";

import { POWER_DEFAULTS } from "../../fit/power-defaults";
import { useMassSettings } from "../../hooks/use-mass-settings";

export function DefaultMassAlert(): ReactElement | null {
  const { mass, loaded } = useMassSettings();
  if (!loaded || mass != null) {
    return null;
  }

  return (
    <p className="default-mass-alert" role="status">
      Power was estimated with default weights: rider{" "}
      {POWER_DEFAULTS.mass.riderKg} kg, bike {POWER_DEFAULTS.mass.bikeKg} kg.
      Set yours in <Link to="/?view=settings">Settings</Link> for better
      accuracy.
    </p>
  );
}
